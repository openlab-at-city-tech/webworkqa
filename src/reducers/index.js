import { combineReducers } from 'redux'
import {
	SET_APP_IS_LOADING,

	REQUEST_PROBLEM, RECEIVE_PROBLEM,
	REQUEST_PROBLEMS, RECEIVE_PROBLEMS, RECEIVE_PROBLEM_IDS,

	RECEIVE_QUESTION, RECEIVE_QUESTIONS, RECEIVE_QUESTION_IDS,
	RECEIVE_QUESTIONS_BY_ID, RECEIVE_QUESTION_BY_ID,
	CHANGE_QUESTION_TEXT, SET_QUESTION_PENDING,

	RECEIVE_RESPONSE, RECEIVE_RESPONSES,
	RECEIVE_RESPONSE_ID_MAP, RECEIVE_RESPONSE_ID_FOR_MAP,
	SET_RESPONSE_ANSWERED, SET_RESPONSE_PENDING, SET_RESPONSES_PENDING_BULK,
	CHANGE_RESPONSE_TEXT,

	SET_VOTE, SET_VOTES_BULK, TOGGLE_VOTE,
	SET_SCORE, SET_SCORES_BULK, INCR_SCORE,
	SET_INITIAL_LOAD_COMPLETE,
	TOGGLE_ACCORDION,

	SET_FILTER_TOGGLE
} from '../actions'

function appIsLoading( state = false, action ) {
	switch ( action.type ) {
		case SET_APP_IS_LOADING :
			const { appIsLoading } = action.payload
			return appIsLoading

		default:
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

function currentFilters( state = {
	answeredQuestions: false,
	unansweredQuestions: false
}, action ) {
	switch ( action.type ) {
		case SET_FILTER_TOGGLE :
			const { slug, contrary } = action.payload

			return Object.assign( {}, state, {
				[ slug ]: true,
				[ contrary ]: false
			} )

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

function problems( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_PROBLEMS :
			return action.payload

		default :
			return state
	}
}

function problemIds( state = [], action ) {
	switch ( action.type ) {
		case RECEIVE_PROBLEM_IDS :
			return action.payload

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

		case RECEIVE_QUESTIONS_BY_ID :
		case RECEIVE_QUESTION_IDS :
			return action.payload

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

		case SET_RESPONSES_PENDING_BULK :
			return action.payload

		default :
			return state
	}
}

function responseIdMap( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSE_ID_FOR_MAP :
			const { questionId, responseId } = action.payload

			let questionResponseIds = []
			if ( state.hasOwnProperty( questionId ) ) {
				// Clone the original array to avoid reference problems.
				questionResponseIds = state[questionId].slice(0)
				questionResponseIds.push( responseId )
			} else {
				questionResponseIds.push( responseId )
			}

			return Object.assign( {}, state, {
				[questionId]: questionResponseIds
			} )

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

		case SET_RESPONSE_ANSWERED :
			const { responseId, isAnswered } = action.payload
			let response = state[responseId]
			response.isAnswer = isAnswered
			return Object.assign( {}, state, {
				[responseId]: response
			} )
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

		case SET_SCORES_BULK :
			return action.payload

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

		case SET_VOTES_BULK :
			return action.payload

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
  appIsLoading,
  collapsed,
  currentFilters,
  initialLoadComplete,
  problemIds,
  problems,
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
