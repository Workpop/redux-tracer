import { createSelector } from 'reselect';
import { composeAll, withClear, withMerge } from '@workpop/dux';
import { get, each, isFunction } from 'lodash';

export const CLEAR_NEWRELIC_TRACER = 'CLEAR_NEWRELIC_TRACER';
export const SET_NEWRELIC_TRACER = 'SET_NEWRELIC_TRACER';
const NEW_RELIC_TRACER_ERROR = 'NEW_RELIC_TRACER_ERROR';

export function setTracer(tracerName, tracer) {
  return {
    type: SET_NEWRELIC_TRACER,
    payload: {
      [tracerName]: tracer,
    },
  };
}

export function clearTracer(tracerName) {
  return {
    type: CLEAR_NEWRELIC_TRACER,
    payload: {
      tracerName,
    },
  };
}

function tracerSelector(state, tracerName) {
  return { [tracerName]: get(state, `newRelicTracerReducer.${tracerName}`) };
}

export const newRelicTracerReducer = composeAll(
  withClear(CLEAR_NEWRELIC_TRACER),
  withMerge(SET_NEWRELIC_TRACER)
)({});

export const getNRTracer = createSelector(tracerSelector, (tracerFn) => {
  return tracerFn;
});

export function createTracer({
  tracerName,
  invariant,
  customAttributes = {},
  log,
}) {
  return (dispatch, getState) => {
    if (!window.newrelic) {
      return dispatch({
        type: NEW_RELIC_TRACER_ERROR,
        error:
          'Cannot find new relic namespace, did you forget to include the script it in head?',
      });
    }

    if (isFunction(invariant) && !invariant(getState())) {
      return dispatch({
        type: NEW_RELIC_TRACER_ERROR,
        error: 'Invariant violated',
      });
    }

    // create a browser interaction
    each(customAttributes, (value, key) => {
      return window.newrelic.setCustomAttribute(key, value);
    });

    const nri = window.newrelic.interaction();

    if (isFunction(log)) {
      log();
    }

    nri.save();
    const tracer = nri.createTracer(tracerName);

    return dispatch(setTracer(tracerName, tracer));
  };
}
