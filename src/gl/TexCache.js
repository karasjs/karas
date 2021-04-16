import webgl from './webgl';

class TexCache {
  constructor(units) {
    this.__units = units; // 通道数量限制，8~16
    this.__pages = []; // 存当前page列表，通道数量8~16，缓存收留尽可能多的page
    this.__infos = []; // 同上存[cache, opacity, matrix]，1个page中会有多个要绘制的cache
    this.__textureChannels = []; // 每个纹理通道记录还是个数组，下标即纹理单元，内容为Page
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
   */
  addTexAndDrawWhenLimit(gl, cache, opacity, matrix, cx, cy) {
    let pages = this.__pages;
    let infos = this.__infos;
    let page = cache.page;
    let i = pages.indexOf(page);
    // 找到说明已有page在此索引的通道中，记录下来info
    if(i > -1) {
      infos[i].push([cache, opacity, matrix]);
    }
    // 找不到说明是新的纹理贴图，此时看是否超过纹理单元限制，超过则刷新绘制并清空，然后/否则 存入纹理列表
    else {
      i = pages.length;
      if(i > this.__units) {
        // 绘制且清空，队列索引重新为0
        this.refresh(gl, cx, cy, pages, infos);
        i = 0;
      }
      pages.push(page);
      let info = infos[i] = infos[i] || [];
      info.push([cache, opacity, matrix]);
    }
  }

  /**
   * 刷新
   * @param gl
   * @param cx
   * @param cy
   * @param pages
   * @param infos
   */
  refresh(gl, cx, cy, pages, infos) {
    pages = pages || this.__pages;
    infos = infos || this.__infos;
    // 防止空调用刷新
    if(pages.length) {
      let textureChannels = this.textureChannels;
      // 先将上次渲染的纹理单元使用的Page形成一个hash，键为page的uuid，值为纹理单元
      let lastHash = {};
      textureChannels.forEach((item, i) => {
        if(item) {
          let uuid = item.uuid;
          lastHash[uuid] = i;
        }
      });
      // 本次再遍历，查找相同的Page并保持其使用的纹理单元不变，存入相同索引下标oldList，不同的按顺序收集放newList
      let oldList = [], newList = [];
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
      // 以oldList为基准，将newList依次存入oldList的空白处，即新纹理单元索引
      if(newList.length) {
        let count = 0;
        for(let i = 0, len = oldList.length; i < len; i++) {
          let item = oldList[i];
          if(item) {
            count++;
          }
          else if(newList.length) {
            oldList[i] = newList.shift();
          }
          else {
            break;
          }
        }
        // 可能上面遍历会有新的没放完，出现在一开始没用光所有纹理单元的情况，追加到尾部即可
        if(newList.length) {
          oldList = oldList.concat(newList);
        }
      }
      // 对比上帧渲染的和这次纹理单元情况，Page相同且version相同可以省略更新，其它均重新赋值纹理
      // 后续局部更新Page相同但version不同，会出现没有上帧的情况如初始渲染，此时先创建纹理单元再更新
      // 将新的数据赋给老的，可能新的一帧使用的少于上一帧，老的没用到的需继续保留
      let hash = {};
      for(let i = 0, len = oldList.length; i < len; i++) {
        let page = oldList[i];
        let last = textureChannels[i];
        if(!last || last !== page || page.update) {
          webgl.createTexture(gl, page.canvas, i);
          textureChannels[i] = page;
          hash[page.uuid] = i;
        }
        else {
          hash[page.uuid] = i;
        }
        page.update = false;
      }
      // 再次遍历开始本次渲染并清空
      webgl.drawTextureCache(gl, infos, hash, cx, cy);
      pages.splice(0);
      infos.splice(0);
    }
  }

  get textureChannels() {
    return this.__textureChannels;
  }
}

export default TexCache;
