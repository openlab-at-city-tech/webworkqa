import { RECEIVE_QUESTION_BY_ID, RECEIVE_QUESTIONS_BY_ID, RECEIVE_QUESTION_IDS } from '../actions/questions'

export function questionsById( state = [], action ) {
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

