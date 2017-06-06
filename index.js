const subscribers = {};
let store;
let index = 0;


const ERROR_INIT = 'You have to initialize redux-state-connect by passing Store into it.';


export function connect(stateMap, component) {
  if (!store) return console.error(ERROR_INIT);

  const curIndex = index;
  index += index;

  subscribers[curIndex] = {
    stateMap,
    component,
  };

  const newState = store.getState();
  const mapState = stateMap(newState);
  component.setState(mapState);

  return function disconnect() {
    delete subscribers[curIndex];
  };
}

export function dispatchify(dispatchMap, component) {
  if (!store) return console.error(ERROR_INIT);

  Object.keys(dispatchMap).forEach((key) => {
    component[key] = (...args) => store.dispatch(dispatchMap[key](...args));
  });
}

export function init(s) {
  store = s;

  store.subscribe(() => {
    const newState = store.getState();

    Object.keys(subscribers).forEach((key) => {
      const subscriber = subscribers[key];
      const mapState = subscriber.stateMap(newState);

      subscriber.component.setState(mapState);
    });
  });

  return connect;
}


export default {
  init,
  connect,
  dispatchify,
};
