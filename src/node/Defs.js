class Defs {
  constructor(uuid) {
    this.id = uuid;
    this.count = 0;
    this.list = [];
  }
  add(data) {
    data.uuid = 'karas-defs-' + this.id + '-' + this.count++;
    data.index = this.list.length;
    this.list.push(data);
    return data.uuid;
  }
  clear() {
    this.list = [];
    this.count = 0;
  }
  removeCache(data) {
    let list = this.list;
    let i = data.index;
    // 一般情况index即位置，但每次渲染过程中，可能会删掉一些，此时位置会往前，但index不变，因此遍历
    for(; i >= 0; i--) {
      if(list[i] === data) {
        list.splice(i, 1);
        return;
      }
    }
  }

  get value() {
    return this.list;
  }

  static getInstance(uuid) {
    return new Defs(uuid);
  }
}

export default Defs;
