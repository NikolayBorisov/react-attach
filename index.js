const subscribers = {};
let store;
let index = 0;

const ERROR_INIT = 'You have to initialize redux-state-connect by passing Store into it.';
const ERROR_CONNECT_ARG2_FUNC_OR_THIS = 'Second argument in [connect] must be a function or a "this".';
const ERROR_CONNECT_ARG1_FUNC = 'First argument in [connect] must be a function.';
const ERROR_DISPACTHIFY_ARG2_OBJECT = 'Second argument in [dispatchify] must be an object.';

const noop = () => {};

function isFunction(x) {
  return typeof x === 'function';
}


export function mapStoreToState(storeMap, obj) {
  const component = obj;

  if (!store) {
    console.error(ERROR_INIT);
    return noop;
  }
  if (!component || (!isFunction(component) && !isFunction(component.setState))) {
    console.error(ERROR_CONNECT_ARG2_FUNC_OR_THIS);
    return noop;
  }
  if (!isFunction(storeMap)) {
    console.error(ERROR_CONNECT_ARG1_FUNC);
    return noop;
  }

  const curIndex = index;
  index += 1;

  subscribers[curIndex] = {
    storeMap,
    component,
  };

  const newState = store.getState();
  const mapState = storeMap(newState);

  if (isFunction(component)) {
    component(mapState);
  } else {
    Object.assign(component.state, mapState);
  }

  return function detach() {
    delete subscribers[curIndex];
  };
}


export function mapDispatchToThis(dispatchMap, obj) {
  const component = obj;

  if (!store) {
    console.error(ERROR_INIT);
    return;
  }
  if (!component) {
    console.error(ERROR_DISPACTHIFY_ARG2_OBJECT);
    return;
  }

  if (isFunction(dispatchMap)) {
    const fns = dispatchMap(store.dispatch);
    Object.keys(fns).forEach((key) => {
      component[key] = fns[key];
    });
  } else {
    Object.keys(dispatchMap).forEach((key) => {
      component[key] = (...args) => store.dispatch(dispatchMap[key](...args));
    });
  }
}


export const attach = (stateMap, dispatchMap) => WrappedComponent => (
  class Attach extends WrappedComponent {
    constructor(props) {
      super(props);
      this.constructor.displayName = `Attach(${super.constructor.name})`;
      this.detach = mapStoreToState(stateMap, this);
      mapDispatchToThis(dispatchMap, this);
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
      this.detach();
    }

    render() {
      return super.render();
    }
  }
);


export function init(s) {
  store = s;

  store.subscribe(() => {
    const newState = store.getState();

    Object.keys(subscribers).forEach((key) => {
      const subscriber = subscribers[key];
      const component = subscriber.component;
      const mapState = subscriber.storeMap(newState);

      if (isFunction(component)) {
        component(mapState);
      } else {
        component.setState(mapState);
      }
    });
  });

  return attach;
}


export default {
  init,
  mapStoreToState,
  mapDispatchToThis,
  attach,
};
