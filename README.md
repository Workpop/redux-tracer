# redux-tracer

## Installation

```sh
yarn add @workpop/redux-tracer
```

## API

* `createTracer`

```js
type CreateTracerType = {
  invariant?: Function,
  tracerName: string,
  // Custom Attributes you want to seet in new relic
  customAttributes: Object,
  log: Function,
}
```

* `getNRTracer(state: Object, tracerName: string)`

* `clearTracer(tracerName: string)`

## Basic Usage
1.Setup in combineReducers

```JavaScript
import { createStore } from 'redux';
import { newRelicTracerReducer } from '@workpop/redux-tracer';
...  
const store = createStore({
  ...reducers,
  newRelicTracerReducer,
});
```

2. Dispatch createTracer action

```JavaScript
import { createTracer } from '@workpop/redux-tracer';

store.dispatch(
  createTracer({
    tracerName: 'testTracer',
  })
);
```

3. Connect and execute tracer

```js
import React from 'react';
import { connect } from 'react-redux';
import { getNRTracer } from '@workpop/redux-tracer';

function Test({ testTracer }) {
  return <p onClick={function () { return testTracer(); }}>Hello</h1>
}

function mapStateToProps(state) {
  return getNRTracer(state, 'testTracer');
}

export default connect(mapStateToProps)(Test)
```


## License

MIT
