import isFunction from 'lodash-es/isFunction';

import { subscribe } from './utils/subscription';
import { getState } from './store';


const noop = () => {};

export default function mapStoreToState(storeMap, obj, options) {
  const component = obj;

  if (!component || (!isFunction(component) && !isFunction(component.setState))) {
    console.error('Wrong second parameter in mapStoreToState.');
    return noop;
  }
  if (!isFunction(storeMap)) {
    console.error('Wrong first parameter in mapStoreToState.');
    return noop;
  }

  const newState = getState();
  const mapState = storeMap(newState);

  if (isFunction(component)) {
    component(mapState);
  } else {
    Object.assign(component.state, mapState);
  }

  const subscriber = {
    storeMap,
    component,
  };

  if (options.noShallow) {
    subscriber.noShallow = true;
  }

  return subscribe(subscriber);
}
