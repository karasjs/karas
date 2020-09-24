class Cache {
  constructor(mode) {
    this.__mode = mode;
  }

  get mode() {
    return this.__mode;
  }
}

export default Cache;
