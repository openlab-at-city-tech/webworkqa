import { RECEIVE_QUESTION, RECEIVE_QUESTIONS, REMOVE_QUESTION, RESET_QUESTIONS } from '../actions/questions'

export function questions( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_QUESTION :
			return Object.assign( {}, state, {
				[action.payload.questionId]: action.payload
			} )

		case RECEIVE_QUESTIONS :
			return Object.assign( {}, state, action.payload )

		case REMOVE_QUESTION :
			let newQuestions = Object.assign( {}, state )
			delete( newQuestions[ action.payload.questionId ] )
			return newQuestions

		case RESET_QUESTIONS :
			return {}

		default :
			return state
	}
}
