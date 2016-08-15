import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { getUserIfNeeded } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger();

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware, // allows dispatch() functions
        loggerMiddleware // middleware that logs actions
    )
);

store.dispatch(getUserIfNeeded()).then(() =>
    console.log(store.getState())
);
