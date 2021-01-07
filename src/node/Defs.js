class Defs {
  constructor(uuid) {
    this.id = uuid;
    this.count = 0;
    this.list = [];
    this.cacheHash = {}; // 每次svg渲染前重置，存储前次渲染不变的缓存id
  }
  add(data) {
    let uuid = this.count;
    let hash = this.cacheHash;
    while(hash.hasOwnProperty(uuid)) {
      uuid++;
    }
    this.count = uuid + 1;
    data.id = uuid;
    data.uuid = 'karas-defs-' + this.id + '-' + uuid;
    data.index = this.list.length;
    this.list.push(data);
    return data.uuid;
  }
  addCache(data) {
    data.index = this.list.length;
    this.list.push(data);
    this.cacheHash[data.id] = true;
    return data.uuid;
  }
  clear() {
    this.list = [];
    this.count = 0;
    this.cacheHash = {};
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
