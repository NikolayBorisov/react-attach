import isFunction from 'lodash-es/isFunction';

import shallowEqual from './utils/shallowEqual';
import { getSubscribers } from './utils/subscription';


let store = {};

export const dispatch = (...props) => store.dispatch(...props);
export const getState = () => store.getState();

export const attachStore = (s) => {
  store = s;

  store.subscribe(() => {
    const prevState = getState();

    getSubscribers().forEach((subscriber) => {
      const component = subscriber.component;
      const nextState = subscriber.storeMap(prevState);

      if (subscriber.noShallow || !shallowEqual(prevState, nextState)) {
        if (isFunction(component)) {
          component(nextState);
        } else {
          component.setState(nextState);
        }
      }
    });
  });
};

