class WorkerStore {
  constructor() {
    this.worker = new Worker('./worker.js');
    this.worker.onmessage = this.onMessage.bind(this);
    this.listeners = [];
    this.latestState = null;
  }

  getState() {
    return this.latestState;
  }

  dispatch(action) {
    this.worker.postMessage({
      type: 'DISPATCH',
      payload: action,
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  callListeners() {
    this.listeners.forEach((listener) => listener());
  }

  onMessage(stuff) {
    const message = stuff.data;
    if (message.type === 'UPDATE') {
      this.latestState = message.payload;
      this.callListeners();
    }
  }
}


store = new WorkerStore();

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'UP' });
