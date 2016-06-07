import { combineReducers } from 'redux'
import {
	TOGGLE_VOTE,
	REQUEST_PROBLEM,
	RECEIVE_PROBLEM
} from '../actions'

function votes( state = [], action ) {
	switch ( action.type ) {
		case TOGGLE_VOTE :
			return [
				...state
			];

		default :
			return state
	}
}

function problem( state = {
	isFetching: false,
	didInvalidate: false,
	problemData: {},
	questions: {},
	questionsById: []
}, action ) {
	switch ( action.type ) {
		case REQUEST_PROBLEM :
			return Object.assign( {}, state, {
				isFetching: true,
				didInvalidate: false
			} );

		case RECEIVE_PROBLEM :
			return Object.assign( {}, state, {
				isFetching: false,
				didInvalidate: false,
				problemData: action.problemData,
				questions: action.questions,
				questionsById: action.questionsById
			} );

		default :
			return state
	}
}

const webworkApp = combineReducers({
  votes,
  problem
})

export default webworkApp
