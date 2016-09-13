import { SET_TEXTAREA_VALUE } from '../actions/app'
import { SET_QUESTION_PENDING } from '../actions/questions'

export function formData( state = {
	isPending: false,
	content: '',
	tried: ''
}, action ) {
	switch ( action.type ) {
		case SET_TEXTAREA_VALUE :
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
