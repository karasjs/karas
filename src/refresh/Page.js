import inject from '../util/inject';

let SIZE   = [8, 16, 32, 64, 128, 256, 512, 1024, 2048];
let NUMBER = [8,  8,  8,  8,   8,   4,   2,    1,    1];
let MAX = SIZE[SIZE.length - 1];
const HASH = {};

class Page {
  constructor(size, number) {
    this.__size = size;
    this.__number = number;
    this.__free = this.__total = number * number;
    size *= number;
    let offScreen = this.__canvas = inject.getCacheCanvas(size, size);
    if(offScreen) {
      this.__offScreen = offScreen;
    }
    // 1/0标识n*n个单元格是否空闲可用，一维数组表示
    this.__grid = [];
    for(let i = 0; i < this.__total; i++) {
      this.__grid.push(1);
    }
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

  get size() {
    return this.__size;
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

  static getInstance(size) {
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
      page = new Page(s, n);
      if(!page.offScreen) {
        console.error('Can not create off-screen for page');
        return;
      }
      list.push(page);
    }
    let pos = page.add();
    return { page, pos };
  }

  // static set MAX(v) {
  //   let n = v;
  //   while(n > 2) {
  //     n = n % 2;
  //   }
  //   if(n !== 0) {
  //     console.error('Page max-size must be a multiple of 2');
  //     return;
  //   }
  //   if(v < 8) {
  //     console.error('Page max-size must >= 8');
  //     return;
  //   }
  //   MAX = v;
  //   n = 1;
  //   SIZE = [];
  //   NUMBER = [];
  //   while(true) {
  //     SIZE.unshift(v);
  //     NUMBER.unshift(n);
  //     v >>= 1;
  //     // canvas太大初始化会卡，这里限制8个
  //     if(n < 8) {
  //       n <<= 1;
  //     }
  //     if(v < 8) {
  //       break;
  //     }
  //   }
  // }

  static set SIZE(v) {
    if(!v || !Array.isArray(v.SIZE) || !Array.isArray(v.NUMBER)) {
      return;
    }
    SIZE = v.SIZE;
    NUMBER = v.NUMBER;
    MAX = SIZE[SIZE.length - 1];
  }

  static get MAX() {
    return MAX;
  }
}

export default Page;
