class EventEmitter {
  events = new Map();

  on(name, fn) {
    this.events.set(name, fn);
  }

  emit(name, ...args) {
    const fn = this.events.get(name);
    if (!fn) return;
    fn(...args);
  }
}

export default new EventEmitter();
