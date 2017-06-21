import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { fetchQuestionIndexList } from './actions/questions'

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

	let prevState = {
		currentFilters: {}
	}
	store.subscribe(() => {
		const { currentFilters } = store.getState()
		const prevFilters = prevState.currentFilters;

		prevState.currentFilters = currentFilters

		let currentFiltersHaveChanged = false
		if ( currentFilters.length !== prevFilters.length ) {
			currentFiltersHaveChanged = true
		} else {
			for ( var i in currentFilters ) {
				if ( ! prevFilters.hasOwnProperty( i ) || prevFilters[ i ] !== currentFilters[ i ] ) {
					currentFiltersHaveChanged = true
					break
				}
			}
		}

		if ( currentFiltersHaveChanged ) {
			store.dispatch( fetchQuestionIndexList( false ) )
			prevState.currentFilters = currentFilters
		}
//		console.log( 'there is a change' )
//		store.dispatch(something())
	})

	return store
};
