import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger({
	level: 'log',
	collapsed: true
})

let middleware
if ( 'development' === process.env.NODE_ENV ) {
	middleware = applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
} else {
	middleware = applyMiddleware(
		thunkMiddleware
	)
}


export default function configureStore( initialState ) {
	const store = createStore(
		rootReducer,
		initialState,
		middleware,
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)

	return store
};
