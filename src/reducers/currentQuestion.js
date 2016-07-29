import { SET_CURRENT_QUESTION } from '../actions/app'

export function currentQuestion( state = null, action ) {
	switch ( action.type ) {
		case SET_CURRENT_QUESTION :
			return action.payload.questionId

		default :
			return state
	}
}
