import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncHistoryWithStore } from 'react-router-redux'

export default function configureStore( initialState ) {
	const history = createBrowserHistory()

	const middleware = applyMiddleware(
		thunkMiddleware
	)

	const store = createStore(
		rootReducer,
		initialState,
		compose(
			middleware,
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	)

	syncHistoryWithStore( history, store )

	return store
};
