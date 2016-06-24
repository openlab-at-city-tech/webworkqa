import { combineReducers } from 'redux'
import {
	REQUEST_PROBLEM, RECEIVE_PROBLEM,

	RECEIVE_QUESTION, RECEIVE_QUESTIONS,
	RECEIVE_QUESTIONS_BY_ID, RECEIVE_QUESTION_BY_ID,
	CHANGE_QUESTION_TEXT, SET_QUESTION_PENDING,

	RECEIVE_RESPONSE, RECEIVE_RESPONSES,
	RECEIVE_RESPONSE_ID_MAP, RECEIVE_RESPONSE_ID_FOR_MAP,
	SET_RESPONSE_ANSWERED, SET_RESPONSE_PENDING, CHANGE_RESPONSE_TEXT,

	SET_VOTE, TOGGLE_VOTE,
	SET_SCORE, INCR_SCORE,
	SET_INITIAL_LOAD_COMPLETE,
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

function initialLoadComplete( state = false, action ) {
	switch ( action.type ) {
		case SET_INITIAL_LOAD_COMPLETE :
			return action.payload

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
			const { title, content, ID } = action.payload
			return Object.assign( {}, state, {
				ID,
				title,
				content
			} );

		default :
			return state
	}
}

function questions( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_QUESTION :
			return Object.assign( {}, state, {
				[action.payload.questionId]: action.payload
			} )

		case RECEIVE_QUESTIONS :
			return action.payload

		default :
			return state
	}
}

function questionsById( state = [], action ) {
	switch ( action.type ) {
		case RECEIVE_QUESTION_BY_ID :
			let newState = state
			newState.push( action.payload.questionId )
			return newState

		default :
			return state
	}
}

function questionFormData( state = {
	isPending: false,
	content: '',
	tried: ''
}, action ) {
	switch ( action.type ) {
		case CHANGE_QUESTION_TEXT :
			const { fieldName, value } = action.payload

			return Object.assign( {}, state, {
				[fieldName]: value
			} )

		case SET_QUESTION_PENDING :
			return Object.assign( {}, state, {
				isPending: action.payload.isPending
			} )

		default :
			return state
	}
}

function responseFormData( state = {}, action ) {
	switch ( action.type ) {
		case CHANGE_RESPONSE_TEXT :
			const { questionId, value } = action.payload

			return Object.assign( {}, state, {
				[questionId]: value
			} )

		default :
			return state
	}
}

function responseFormPending( state = {}, action ) {
	switch ( action.type ) {
		case SET_RESPONSE_PENDING :
			const { questionId, isPending } = action.payload

			return Object.assign( {}, state, {
				[questionId]: isPending
			} )

		default :
			return state
	}
}

function responseIdMap( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSE_ID_FOR_MAP :
			const { questionId, responseId } = action.payload
			let newState = Object.assign( {}, state )
			newState[questionId].push(responseId)
			return newState

		case RECEIVE_RESPONSE_ID_MAP :
			return action.payload

		default :
			return state
	}
}

function responses( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSE :
			return Object.assign( {}, state, {
				[action.payload.responseId]: action.payload
			} )

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
  initialLoadComplete,
  problem,
  questions,
  questionsById,
  questionFormData,
  responseFormData,
  responseFormPending,
  responseIdMap,
  responses,
  scores,
  votes,
})

export default rootReducer
