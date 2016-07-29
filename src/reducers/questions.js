import { RECEIVE_QUESTION, RECEIVE_QUESTIONS } from '../actions/questions'

export function questions( state = {}, action ) {
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