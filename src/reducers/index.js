import { combineReducers } from 'redux'
import {
	REQUEST_PROBLEM, RECEIVE_PROBLEM,
	RECEIVE_QUESTIONS,
	RECEIVE_QUESTIONS_BY_ID,
	SET_VOTE,
	INCR_SCORE, SET_SCORE
} from '../actions'

function problem( state = {
	ID: '',
	title: '',
	content: '',
}, action ) {
	switch ( action.type ) {
		case REQUEST_PROBLEM :
			return Object.assign( {}, state, {
				isFetching: true,
				didInvalidate: false
			} );

		case RECEIVE_PROBLEM :
			const { title, content } = action.payload
			return Object.assign( {}, state, {
				title,
				content
			} );

		default :
			return state
	}
}

function questions( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_QUESTIONS :
			return action.payload

		default :
			return state
	}
}

function questionsById( state = [], action ) {
	switch ( action.type ) {
		case RECEIVE_QUESTIONS_BY_ID :
			return action.payload

		default :
			return state
	}
}

function scores( state = {}, action ) {
	let itemId = 0;

	switch ( action.type ) {
		case INCR_SCORE :
			itemId = action.payload.itemId
			let currentScore = state.hasOwnProperty( itemId ) ? state[itemId] : 0

			return Object.assign( {}, state, {
				[itemId]: Number( currentScore ) + Number( action.payload.incr )
			} )

		case SET_SCORE :
			itemId = action.payload.itemId
			return Object.assign( {}, state, {
				[itemId]: action.payload.score
			} )

		default :
			return state
	}
}

function votes( state = {}, action ) {
	switch ( action.type ) {
		case SET_VOTE :
			const { itemId, voteType } = action.payload

			let currentVote = state.hasOwnProperty( itemId ) ? state[itemId] : ''

			return Object.assign( {}, state, {
				[itemId]: voteType
			} )

		default :
			return state
	}
}

const rootReducer = combineReducers({
  problem,
  questions,
  questionsById,
  scores,
  votes,
})

export default rootReducer
