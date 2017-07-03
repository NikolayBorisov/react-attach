import mapStoreToState from './mapStoreToState';
import mapDispatchToThis from './mapDispatchToThis';

export default (stateMap, dispatchMap, options = {}) => WrappedComponent => (
  class Attach extends WrappedComponent {
    constructor(props) {
      super(props);
      this.constructor.displayName = `Attach(${super.constructor.name})`;
      this.detach = mapStoreToState(stateMap, this, options);
      mapDispatchToThis(dispatchMap, this, options);
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
