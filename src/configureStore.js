import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { fetchQuestionIndexList } from './actions/questions'
import { getCurrentHash, getViewFromHash } from './util/webwork-url-parser'

export default function configureStore( initialState ) {
	const history = createBrowserHistory()

	const middleware = applyMiddleware(
		routerMiddleware( history ),
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

	let prevHash = getCurrentHash( store.getState().routing )

	store.subscribe(() => {
		const currentHash = getCurrentHash( store.getState().routing )

		const hashIsChanged = currentHash !== prevHash

		// Set prevHash to avoid recursion during dispatch.
		prevHash = currentHash

		if ( hashIsChanged ) {
			const newView = getViewFromHash( currentHash )
			if ( ! newView.hasOwnProperty( 'problemId' ) ) {
				store.dispatch( fetchQuestionIndexList( false ) )
			}
		}

	})

	return store
};
