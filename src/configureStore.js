import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import rootReducer from './reducers'

const browserHistory = createBrowserHistory({
	basename: 'wpmaster/foo1'
})

const middleware = applyMiddleware(
	thunkMiddleware,
	routerMiddleware( browserHistory )
)

export default function configureStore( initialState ) {
	const store = createStore(
		rootReducer,
		initialState,
		compose(
			middleware,
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	)

	return store
};
