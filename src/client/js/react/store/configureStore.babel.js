import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/reducers.babel';

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        compose(
            applyMiddleware(thunkMiddleware, createLogger()),
            window.devToolsExtension && window.devToolsExtension()
        )
    );
}
