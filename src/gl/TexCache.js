import webgl from './webgl';
import MockPage from './MockPage';
import inject from '../util/inject';

class TexCache {
  constructor(units) {
    this.__units = units; // 通道数量限制，8~16
    this.__pages = []; // 存当前page列表，通道数量8~16，缓存收留尽可能多的page
    this.__list = []; // 本次渲染暂存的数据，[cache, opacity, matrix, dx, dy]
    this.__channels = []; // 每个纹理通道记录还是个数组，下标即纹理单元，内容为Page
    this.__locks = []; // 锁定纹理单元列表，下标即纹理单元，内容true为锁定
    this.__lockUnits = 0;
  }

  /**
   * webgl每次绘制为添加纹理并绘制，此处尝试尽可能收集所有纹理贴图，以达到尽可能多的共享纹理，再一次性绘制
   * 收集的是Page对象（从cache中取得），里面包含了若干个节点的贴图，canvas本身是2的幂次方大小
   * webgl最少有8个纹理单元最多16个，因此存了一个列表来放这些Page的canvas，刷新后清空，但纹理通道映射记录保留
   * 当8个纹理单元全部满了，进行绘制并清空这个队列，外部主循环结束时也会检查队列是否还有余留并绘制
   * 初始调用队列为空，存入Page对象，后续调用先查看是否存在以便复用，再决定是否存入Page，直到8个满了
   * Page上存有update表示是否更新，每次cache绘制时会变true，以此表示是否有贴图更新，删除可以忽视
   * 还需要一个记录上次纹理通道使用哪个Page的canvas的地方，即映射，清空后队列再次添加时，如果Page之前被添加过，
   * 此次又被添加且没有变更update，可以直接复用上次的纹理单元号且无需再次上传纹理，节省性能
   * 后续接入局部纹理更新也是复用单元号，如果update变更可以选择局部上传纹理而非整个重新上传
   * 判断上传的逻辑在收集满8个后绘制前进行，因为添加队列过程中可能会变更Page及其update
   * @param gl
   * @param cache
   * @param opacity
   * @param matrix
   * @param cx
   * @param cy
   * @param dx
   * @param dy
   * @param revertY
   */
  addTexAndDrawWhenLimit(gl, cache, opacity, matrix, cx, cy, dx = 0, dy = 0, revertY) {
    let pages = this.__pages;
    let list = this.__list;
    let page = cache.page;
    let i = pages.indexOf(page);
    // 找到说明已有page在此索引的通道中，记录下来info
    if(i > -1) {
      list.push([cache, opacity, matrix, dx, dy]);
    }
    // 找不到说明是新的纹理贴图，此时看是否超过纹理单元限制，超过则刷新绘制并清空，然后/否则 存入纹理列表
    else {
      i = pages.length;
      if(i >= this.__units - this.__lockUnits) {
        // 绘制且清空，队列索引重新为0
        this.refresh(gl, cx, cy, revertY);
      }
      pages.push(page);
      list.push([cache, opacity, matrix, dx, dy]);
    }
  }

  /**
   * 刷新
   * @param gl
   * @param cx
   * @param cy
   * @param revertY
   */
  refresh(gl, cx, cy, revertY) {
    let pages = this.__pages;
    let list = this.__list;
    // 防止空调用刷新，struct循环结尾会强制调用一次防止有未渲染的
    if(pages.length) {
      let channels = this.channels;
      let locks = this.locks;
      // 先将上次渲染的纹理单元使用的Page形成一个hash，键为page的uuid，值为纹理单元
      let lastHash = {};
      channels.forEach((item, i) => {
        if(item) {
          let uuid = item.uuid;
          lastHash[uuid] = i;
        }
      });
      let units = this.__units;
      // 再遍历，查找相同的Page并保持其使用的纹理单元不变，存入相同索引下标oldList，不同的按顺序收集放newList
      let oldList = new Array(units), newList = [];
      pages.forEach(page => {
        let uuid = page.uuid;
        if(lastHash.hasOwnProperty(uuid)) {
          let index = lastHash[uuid];
          oldList[index] = page;
        }
        else {
          newList.push(page);
        }
      });
      /**
       * 以oldList为基准，将newList依次存入oldList中
       * 优先使用未用过的纹理单元，以便用过的可能下次用到无需重新上传
       * 找不到未用过的后，尝试NRU算法，优先淘汰最近未使用的Page，相等则尺寸小的
       */
      if(newList.length) {
        // 先循环找空的，oldList空且channels空且locks空
        for(let i = 0; i < units; i++) {
          if(!oldList[i] && !channels[i] &&!locks[i]) {
            oldList[i] = newList.shift();
            if(!newList.length) {
              break;
            }
          }
        }
        let len = newList.length;
        if(len) {
          // 按时间排序已使用channel且未被当前占用的，以便淘汰最久未使用的
          let cl = [];
          for(let i = 0; i < units; i++) {
            if(!oldList[i] && !locks[i]) {
              cl.push([i, channels[i]]);
            }
          }
          cl.sort(function(a, b) {
            if(a[1].time !== b[1].time) {
              return (a[1].time || 0) - (b[1].time || 0);
            }
            if(a[1].fullSize !== b[1].fullSize) {
              return a[1].fullSize - b[1].fullSize;
            }
            return a[0] - b[0];
          });
          // cl靠前是时间小尺寸小的，优先使用替换
          for(let i = 0; i < len; i++) {
            oldList[cl[i][0]] = newList[i];
          }
        }
      }
      /**
       * 对比上帧渲染的和这次纹理单元情况，Page相同且!update可以省略更新，其它均重新赋值纹理
       * 后续局部更新Page相同但有update，会出现没有上帧的情况如初始渲染，此时先创建纹理单元再更新
       * 将新的数据赋给老的，可能新的一帧使用的少于上一帧，老的没用到的需继续保留
       */
      let hash = {};
      for(let i = 0, len = oldList.length; i < len; i++) {
        let page = oldList[i];
        // 可能为空，不满的情况下前面单元保留老tex先用的后面的单元
        if(!page) {
          continue;
        }
        let last = channels[i];
        if(!last || last !== page || page.update) {
          // page可能为一个已有fbo纹理，或者贴图
          if(page instanceof MockPage) {
            webgl.bindTexture(gl, page.texture, i);
            channels[i] = page;
          }
          else {
            // 可能老的先删除，注意只删Page，MockPage是fbo生成的texture即total缓存不能自动清除
            if(last && !(last instanceof MockPage)) {
              gl.deleteTexture(last.texture);
            }
            page.texture = webgl.createTexture(gl, page.canvas, i);
            channels[i] = page;
          }
          hash[page.uuid] = i;
        }
        else {
          hash[page.uuid] = i;
        }
        // 标识没有更新，以及最后使用时间
        page.update = false;
        page.time = inject.now();
      }
      // 再次遍历开始本次渲染并清空
      webgl.drawTextureCache(gl, list, hash, cx, cy, revertY);
      pages.splice(0);
      list.splice(0);
    }
  }

  findExistTexChannel(page) {
    return this.channels.indexOf(page);
  }

  /**
   * 获取并锁定一个纹理单元优先使用空的，其次最久未使用的
   * @returns {number|*}
   */
  lockOneChannel() {
    // 优先返回空单元
    let channels = this.channels;
    let locks = this.locks;
    for(let i = 0; i < this.__units; i++) {
      if(!channels[i] && !locks[i]) {
        locks[i] = true;
        this.__lockUnits++;
        return i;
      }
    }
    // 根据NRU返回最久未使用的
    let units = this.__units;
    let cl = [];
    for(let i = 0; i < units; i++) {
      if(!locks[i]) {
        cl.push([i, channels[i]]);
      }
    }
    if(cl.length) {
      cl.sort(function(a, b) {
        if(a[1].time !== b[1].time) {
          return (a[1].time || 0) - (b[1].time || 0);
        }
        if(a[1].fullSize !== b[1].fullSize) {
          return a[1].fullSize - b[1].fullSize;
        }
        return a[0] - b[0];
      });
      let i = cl[0][0];
      channels[i] = null;
      locks[i] = true;
      this.__lockUnits++;
      return i;
    }
    throw new Error('No free texture unit');
  }

  /**
   * 释放掉i单元，并且设置内容到缓存channel中
   * @param i
   * @param setToChannel
   */
  releaseLockChannel(i, setToChannel) {
    if(this.locks[i]) {
      this.locks[i] = false;
      this.__lockUnits--;
      if(setToChannel) {
        this.channels[i] = setToChannel;
      }
    }
  }

  // 指定锁定一个单元
  lockChannel(i) {
    let channels = this.channels;
    let locks = this.locks;
    if(!locks[i]) {
      channels[i] = null;
      locks[i] = true;
      this.__lockUnits++;
    }
  }

  /**
   * 释放纹理单元
   * @param gl
   */
  release(gl) {
    this.channels.forEach(item => {
      if(item) {
        gl.deleteTexture(item.texture);
      }
    });
  }

  get channels() {
    return this.__channels;
  }

  get locks() {
    return this.__locks;
  }

  get last() {
    let list = this.__list, len = list.length;
    if(len) {
      return list[len - 1];
    }
  }
}

export default TexCache;
