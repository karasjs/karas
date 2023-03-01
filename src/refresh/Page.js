/**
 * 默认的动态合图配置，保守低端机8个纹理单元和最大2048px尺寸，一般chrome是16个和16384px
 * webgl初始化会调用获取参数动态进行更改，16px是最小划分基本单位1，后续成2倍增长
 * 并不需要非常紧凑合理，因为特定需求如骨骼动画，合图都是前置做好的，这里应对临时的Dom位图
 * 应该尽可能避免纹理单元切换，因此设计固定的正方形尺寸，以2的幂次方增长，从16px开始到MAX
 * 每个texture从左到右按小到大排列，一列都为相同尺寸的正方形格子，用数组存储表示状态
 * 内容0为空白，1为单位1大小占用，2为2个单位1，如此成2倍增长，可能会形成这种状态：
 * 1 0 2 2 4 4 4 4 ...
 * 其中开头0位置是个单位1的正方形，1位置为空，2、3位置为一个2个单位的正方形，4、5、6、7是4个单位
 * 一张纹理存储时可以按照自己的bbox尺寸计算出正方形大小n，然后循环搜索，每次递增n，不必++遍历
 * 如此可满足不同尺寸分布在一张texture上的需求，碎片情况也较少，避免频繁纹理切换，清空置0
 * canvas模式时固定2048，是个保守值，当webgl第一次初始化，会改变这些值
 */
const UNIT = 16;
let MAX = 2048;
let NUMBER = 128;
const HASH = {};

let uuid = 0;
let init = false;

class Page {
  constructor(renderMode, ctx, size, number) {
    this.__size = size;
    this.__number = number;
    this.__width = this.__height = size;
    // 标识n*n个单元格是否空闲可用，一维数组表示
    this.__grid = new Int8Array(number * number);
    this.__uuid = uuid++;
    // webgl贴图缓存更新使用，canvas/img等发生变更需刷新重新生成texture，fbo的texture不需要
    this.__update = false;
    this.time = 0;
    this.__ctx = ctx;
    this.__count = 0;
  }

  add(unitSize, pos) {
    let { number, grid } = this;
    for(let i = pos; i < pos + unitSize; i++) {
      grid[i] = unitSize;
      for(let j = 1; j < unitSize; j++) {
        grid[i + j * number] = unitSize;
      }
    }
    this.__count++;
  }

  del(pos) {
    let { number, grid } = this;
    let u = grid[pos];
    if(u) {
      grid[pos] = 0;
      for(let i = pos; i < pos + u; i++) {
        grid[i] = 0;
        for(let j = 1; j < u; j++) {
          grid[i + j * number] = 0;
        }
      }
    }
    this.__count--;
  }

  getCoords(pos) {
    let { number } = this;
    let x = (pos % number) * UNIT;
    let y = Math.floor(pos / number) * UNIT;
    return { x, y };
  }

  getFreePos(unitSize) {
    let { number, grid } = this;
    outer:
    for(let i = 0; i < number; i++) {
      let u = grid[i];
      if(u) {
        if(u === unitSize) {
          // 找到同尺寸的列位置，向下查找空白区域确定行位置
          for(let j = unitSize; j < number; j += unitSize) {
            let n = i + j * number;
            if(!grid[n]) {
              return n;
            }
          }
        }
        else {
          i += u - 1;
        }
      }
      else if(i + unitSize <= number) {
        // 空白列检查尺寸是否符合
        for(let j = i + 1, len = i + unitSize; j < len; j++) {
          if(grid[j]) {
            i = j - 1;
            continue outer;
          }
        }
        return i;
      }
    }
    return -1;
  }

  get uuid() {
    return this.__uuid;
  }

  get size() {
    return this.__size;
  }

  get width() {
    return this.__width;
  }

  get height() {
    return this.__height;
  }

  get number() {
    return this.__number;
  }

  get grid() {
    return this.__grid;
  }

  get update() {
    return this.__update;
  }

  set update(v) {
    this.__update = v;
  }

  static getInstance(renderMode, ctx, rootId, size, klass, excludePage) {
    if(size > MAX) {
      return;
    }
    // 换算为每单位16px占多少单位
    let unitSize = 1;
    while((UNIT * unitSize) < size) {
      unitSize <<= 1;
    }
    let m = MAX, n = NUMBER;
    // 限制使用2048，部分机型大尺寸会卡或者黑屏，webgl甚至不渲染，超过的 TODO:
    // if(size < 2048 && MAX === 8192) {
    //   m = 2048;
    //   n = Math.ceil(m / UNIT);
    // }
    let key = rootId + ',' + renderMode;
    // 每个root复用自己的合图，webgl中为了隔离不同实例
    let list = HASH[key] = HASH[key] || [];
    let page, pos;
    for(let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if(excludePage && item === excludePage || item.__size !== m) {
        continue;
      }
      pos = item.getFreePos(unitSize);
      if(pos > -1) {
        page = item;
        break;
      }
    }
    if(!page) {
      page = new klass(renderMode, ctx, m, n);
      pos = 0;
      list.push(page);
    }
    page.add(unitSize, pos);
    return { page, pos };
  }

  static get UNIT() {
    return UNIT;
  }

  static get MAX() {
    return MAX;
  }

  static set MAX(MAX_TEXTURE_SIZE) {
    init = true;
    // 确保MAX_TEXTURE_SIZE是2的幂级数，如果不是向下取整
    let n = 2;
    while(n < MAX_TEXTURE_SIZE) {
      n = n << 1;
      if(n >= MAX_TEXTURE_SIZE) {
        if(n > MAX_TEXTURE_SIZE) {
          n = n << 1;
        }
        break;
      }
    }
    MAX = n;
    NUMBER = Math.ceil(MAX / UNIT);
  }

  static get NUMBER() {
    return NUMBER;
  }

  static genUuid() {
    return uuid++;
  }

  static init(MAX_TEXTURE_SIZE, isAuto) {
    // 手动随时设置，自动仅第一次生效
    if(init && isAuto) {
      return;
    }
    if(MAX_TEXTURE_SIZE !== MAX) {
      // 超过限制会明显卡一下
      Page.MAX = Math.min(MAX_TEXTURE_SIZE, 2048);
    }
  }
}

export default Page;
