import { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createTracer, newRelicTracerReducer, clearTracer, getNRTracer } from '../src';

const rootReducer = combineReducers({ newRelicTracerReducer });
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

describe('redux-tracer', function () {
  window.newrelic = {
    createTracer: () => {},
    interaction: () => {
      return {
        save: () => {
          return true;
        },
        createTracer: () => {
          return true;
        },
      };
    },
  };

  it('should attach the tracer to the redux store', function () {
    store.dispatch(
      createTracer({
        tracerName: 'TEST_TRACER',
      })
    );

    expect(store.getState().newRelicTracerReducer.TEST_TRACER).to.be.ok;
  });

  it('should clear the tracer from store', function () {
    store.dispatch(clearTracer('TEST_TRACER'));

    expect(store.getState().newRelicTracerReducer.TEST_TRACER).not.to.be.ok;
  });

  it('should be able to retrieve the tracer via selector', function () {
    store.dispatch(
      createTracer({
        tracerName: 'TEST_TRACER',
      })
    );

    expect(getNRTracer(store.getState(), 'TEST_TRACER')).to.be.ok;
  });
});
