const subscribers = {};
let index = 0;

export const subscribe = (props) => {
  const curIndex = index;
  index += 1;

  subscribers[curIndex] = props;

  return function detach() {
    delete subscribers[curIndex];
  };
};

export const getSubscribers = () => Object.values(subscribers);

export const forEach = () => Object.values(subscribers).forEach;
