import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger({
	level: 'log',
	collapsed: true
})

export default function configureStore( initialState ) {
	const store = createStore(
		rootReducer,
		initialState,
		applyMiddleware(
			thunkMiddleware,
			loggerMiddleware
		),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)

	return store
};
