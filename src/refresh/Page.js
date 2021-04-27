import inject from '../util/inject';
import mode from '../node/mode';

let SIZE   = [8,   16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
// let NUMBER = [8,  8,  8,  8,   8,   4,   2,    1,    1,    1];
let NUMBER = [128, 64, 32, 16,   8,   4,   2,    1,    1,    1];
let MAX = SIZE[SIZE.length - 1];
const HASH_CANVAS = {};
const HASH_WEBGL = {};

let uuid = 0;

class Page {
  constructor(size, number, renderMode) {
    this.__size = size;
    this.__number = number;
    this.__free = this.__total = number * number;
    size *= number;
    this.__width = size;
    this.__height = size;
    let offScreen = this.__canvas = renderMode === mode.WEBGL
      ? inject.getCacheWebgl(size, size, null, number)
      : inject.getCacheCanvas(size, size, null, number);
    if(offScreen) {
      this.__offScreen = offScreen;
    }
    // 1/0标识n*n个单元格是否空闲可用，一维数组表示
    this.__grid = [];
    for(let i = 0; i < this.__total; i++) {
      this.__grid.push(1);
    }
    this.__uuid = uuid++;
    // webgl贴图缓存使用，一旦更新则标识记录，绑定某号纹理单元查看变化才更新贴图
    this.__update = false;
    this.time = 0;
  }

  add() {
    let { number, grid } = this;
    for(let i = 0; i < number; i++) {
      for(let j = 0; j < number; j++) {
        let index = i * number + j;
        if(grid[index]) {
          grid[index] = 0;
          this.__free--;
          return index;
        }
      }
    }
    // 理论不可能进入，除非bug
    throw new Error('Can not find free page');
  }

  del(pos) {
    this.grid[pos] = 1;
    this.__free++;
  }

  getCoords(pos) {
    let { size, number } = this;
    let x = pos % number;
    let y = Math.floor(pos / number);
    return [x * size, y * size];
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

  get total() {
    return this.__total;
  }

  get free() {
    return this.__free;
  }

  get grid() {
    return this.__grid;
  }

  get offScreen() {
    return this.__offScreen;
  }

  get canvas() {
    return this.offScreen.canvas;
  }

  get ctx() {
    return this.offScreen.ctx;
  }

  get update() {
    return this.__update;
  }

  set update(v) {
    this.__update = v;
  }

  static getInstance(size, renderMode) {
    if(size > MAX) {
      return;
    }
    let s = SIZE[0];
    let n = NUMBER[0];
    // 使用刚好满足的尺寸
    for(let i = 0, len = SIZE.length; i < len; i++) {
      s = SIZE[i];
      n = NUMBER[i];
      if(SIZE[i] >= size) {
        break;
      }
    }
    const HASH = renderMode === mode.WEBGL ? HASH_WEBGL : HASH_CANVAS;
    let list = HASH[s] = HASH[s] || [];
    // 从hash列表中尝试取可用的一页，找不到就生成新的页
    let page;
    for(let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if(item.free) {
        page = item;
        break;
      }
    }
    if(!page) {
      page = new Page(s, n, renderMode);
      if(!page.offScreen) {
        inject.error('Can not create off-screen for page');
        return;
      }
      list.push(page);
    }
    let pos = page.add();
    return { page, pos };
  }

  static set CONFIG(v) {
    if(!v || !Array.isArray(v.SIZE) || !Array.isArray(v.NUMBER)) {
      return;
    }
    SIZE = v.SIZE;
    NUMBER = v.NUMBER;
    MAX = SIZE[SIZE.length - 1];
  }

  static get CONFIG() {
    return {
      SIZE,
      NUMBER,
    };
  }

  static get MAX() {
    return MAX;
  }

  static genUuid() {
    return uuid++;
  }
}

export default Page;
