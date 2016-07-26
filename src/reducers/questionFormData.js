import { CHANGE_QUESTION_TEXT, SET_QUESTION_PENDING } from '../actions/questions'

export function questionFormData( state = {
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
