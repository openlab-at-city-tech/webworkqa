import { CHANGE_RESPONSE_TEXT } from '../actions/responses'

export function responseFormData( state = {}, action ) {
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
