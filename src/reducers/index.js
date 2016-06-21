import { combineReducers } from 'redux'
import {
	REQUEST_PROBLEM, RECEIVE_PROBLEM,
	RECEIVE_QUESTIONS,
	RECEIVE_QUESTIONS_BY_ID,
	RECEIVE_RESPONSE_ID_MAP,
	SET_RESPONSE_ANSWERED,
	RECEIVE_RESPONSES,
	SET_VOTE, TOGGLE_VOTE,
	SET_SCORE, INCR_SCORE,
	TOGGLE_ACCORDION
} from '../actions'

function answered( state = {}, action ) {
	switch ( action.type ) {
		case SET_RESPONSE_ANSWERED :
			const { responseId, isAnswered } = action.payload

			if ( ! isAnswered && state.hasOwnProperty( responseId ) ) {
				let newState = Object.assign( {}, state )
				delete newState[ responseId ]
				return newState
			} else if ( isAnswered ) {
				return Object.assign( {}, state, {
					[responseId ]: '1'
				} )
			} else {
				return state
			}
			break
		default :
			return state
	}
}

function collapsed( state = {}, action ) {
	switch ( action.type ) {
		case TOGGLE_ACCORDION :
			const { itemId } = action.payload
			if ( state.hasOwnProperty( itemId ) ) {
				let newState = Object.assign( {}, state )
				delete newState[ itemId ]
				return newState
			} else {
				return Object.assign( {}, state, {
					[itemId]: '1'
				} )
			}
		default :
			return state
	}
}

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

function responseIdMap( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSE_ID_MAP :
			return action.payload

		default :
			return state
	}
}

function responses( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSES :
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
	let itemId = 0
	let voteType = ''

	switch ( action.type ) {
		case SET_VOTE :
			itemId = action.payload.itemId
			voteType = action.payload.voteType

			return Object.assign( {}, state, {
				[itemId]: voteType
			} )

		case TOGGLE_VOTE :
			itemId = action.payload.itemId
			voteType = action.payload.voteType

			let currentVote = state.hasOwnProperty( itemId ) ? state[itemId] : ''

			// Do nothing if current vote is up and you click down, or vice versa.
			if ( '' == currentVote ) {
				return Object.assign( {}, state, {
					[itemId]: voteType
				} )
			} else if ( currentVote == voteType ) {
				let newState = Object.assign( {}, state )
				delete newState[itemId]
				return newState
			}

			return state

		default :
			return state
	}
}

const rootReducer = combineReducers({
  answered,
  collapsed,
  problem,
  questions,
  questionsById,
  responseIdMap,
  responses,
  scores,
  votes,
})

export default rootReducer
