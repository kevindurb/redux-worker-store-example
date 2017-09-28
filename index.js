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

store.subscribe(() => console.log('done', performance.now()));


randomArray = (length, max) => [...new Array(length)]
    .map(() => Math.round(Math.random() * max));

const array = randomArray(100000, 10000);

setInterval(() => {
  console.log('send', performance.now());
  store.dispatch({ type: 'SORT_AND_STORE', payload: array });
}, 1000);
