const subscribers = {};
let store;
let index = 0;

const ERROR_INIT = 'You have to initialize redux-state-connect by passing Store into it.';
const ERROR_CONNECT_ARG2_FUNC_OR_THIS = 'Second argument in [connect] must be a function or a "this".';
const ERROR_CONNECT_ARG1_FUNC = 'First argument in [connect] must be a function.';
const ERROR_DISPACTHIFY_ARG2_OBJECT = 'Second argument in [dispatchify] must be an object.';

function isFunction(x) {
  return typeof x === 'function';
}

export function connect(stateMap, component) {
  if (!store) return console.error(ERROR_INIT);
  if (!component || (!isFunction(component) && !isFunction(component.setState))) {
    return console.error(ERROR_CONNECT_ARG2_FUNC_OR_THIS);
  }
  if (!isFunction(stateMap)) return console.error(ERROR_CONNECT_ARG1_FUNC);

  const curIndex = index;
  index += index;

  subscribers[curIndex] = {
    stateMap,
    component,
  };

  const newState = store.getState();
  const mapState = stateMap(newState);

  if (isFunction(component)) {
    component(mapState);
  } else {
    component.setState(mapState);
  }

  return function disconnect() {
    delete subscribers[curIndex];
  };
}

export function dispatchify(dispatchMap, obj) {
  if (!store) return console.error(ERROR_INIT);
  if (!obj) return console.error(ERROR_DISPACTHIFY_ARG2_OBJECT);

  Object.keys(dispatchMap).forEach((key) => {
    obj[key] = (...args) => store.dispatch(dispatchMap[key](...args));
  });
}

export function init(s) {
  store = s;

  store.subscribe(() => {
    const newState = store.getState();

    Object.keys(subscribers).forEach((key) => {
      const subscriber = subscribers[key];
      const component = subscriber.component;
      const mapState = subscriber.stateMap(newState);

      if (isFunction(component)) {
        component(mapState);
      } else {
        component.setState(mapState);
      }
    });
  });

  return connect;
}


export default {
  init,
  connect,
  dispatchify,
};
