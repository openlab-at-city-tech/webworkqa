import { SET_TEXTAREA_VALUE, SET_TEXTAREA_VALUES, ADD_ATTACHMENT } from '../actions/app'
import { RECEIVE_QUESTION, SET_QUESTION_PENDING } from '../actions/questions'

export function formData( state = {}, action ) {
	let newField, newState

	switch ( action.type ) {
		case ADD_ATTACHMENT :
			const { formId, attData } = action.payload

			const attId = attData.id

			console.log(formId)
			newField = Object.assign( {}, state[ formId ] )
			console.log(newField)
			newField.attachments[ attId ] = attData

			newState = Object.assign( {}, state )
			newState[ formId ] = newField

			return newState

		case SET_TEXTAREA_VALUE :
			const { fieldId, fieldName, value } = action.payload

			newField = Object.assign( {}, state[ fieldId ] )
			newField[ fieldName ] = value

			newState = Object.assign( {}, state )
			newState[ fieldId ] = newField

			return newState

		case SET_TEXTAREA_VALUES :
			const { values } = action.payload
			return Object.assign( {}, state, values )

		case SET_QUESTION_PENDING :
			return Object.assign( {}, state, {
				isPending: action.payload.isPending
			} )

		case RECEIVE_QUESTION :
			const newQuestion = {
				attachments: {},
				content: action.payload.content,
				tried: action.payload.tried
			}
			return Object.assign( {}, state, {
				[ 'question-' + action.payload.questionId ]: newQuestion
			} )

		default :
			return state
	}
}
