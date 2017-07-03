import { SET_TEXTAREA_VALUE, SET_TEXTAREA_VALUES } from '../actions/app'
import { SET_QUESTION_PENDING } from '../actions/questions'

export function formData( state = {}, action ) {
	switch ( action.type ) {
		case SET_TEXTAREA_VALUE :
			const { fieldId, fieldName, value } = action.payload

			let newField = Object.assign( {}, state[ fieldId ] )
			newField[ fieldName ] = value

			let newState = Object.assign( {}, state )
			newState[ fieldId ] = newField

			return newState

		case SET_TEXTAREA_VALUES :
			const { values } = action.payload
			return Object.assign( {}, state, values )

		case SET_QUESTION_PENDING :
			return Object.assign( {}, state, {
				isPending: action.payload.isPending
			} )

		default :
			return state
	}
}
