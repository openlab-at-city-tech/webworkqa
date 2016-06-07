import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import webworkApp from './reducers'

export default function configureStore( initialState ) {
	return createStore(
		webworkApp,
		applyMiddleware(
			thunkMiddleware
		)
	)
};
