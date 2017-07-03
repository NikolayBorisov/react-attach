import isFunction from 'lodash-es/isFunction';

import { dispatch } from './store';


export default function mapDispatchToThis(dispatchMap, obj) {
  const component = obj;

  if (!component) {
    console.error('No Component is provided');
    return;
  }

  if (isFunction(dispatchMap)) {
    const fns = dispatchMap(dispatch);
    Object.keys(fns).forEach((key) => {
      component[key] = fns[key];
    });
  } else {
    Object.keys(dispatchMap).forEach((key) => {
      component[key] = (...args) => dispatch(dispatchMap[key](...args));
    });
  }
}
