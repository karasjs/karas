class Defs {
  constructor(uuid) {
    this.id = uuid;
    this.count = 0;
    this.list = [];
  }
  add(data) {
    data.uuid = `karas-defs-${this.id}-${this.count++}`;
    this.list.push(data);
    return data.uuid;
  }
  clear() {
    this.list = [];
    this.count = 0;
  }

  get value() {
    return this.list;
  }

  static getInstance(uuid) {
    return new Defs(uuid);
  }
}

export default Defs;
