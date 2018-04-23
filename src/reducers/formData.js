import { SET_TEXTAREA_VALUE, SET_TEXTAREA_VALUES, ADD_ATTACHMENT_TO_ITEM } from '../actions/app'
import { RECEIVE_QUESTION, SET_QUESTION_PENDING } from '../actions/questions'

export function formData( state = {}, action ) {
	switch ( action.type ) {
		case ADD_ATTACHMENT_TO_ITEM :
			const { formId, attData } = action.payload
			const attFieldName = action.payload.fieldName

			const attId = attData.id

			let newFieldForAttachment = Object.assign( {}, state[ formId ] )
			let fieldValue = newFieldForAttachment[ attFieldName ]
			const shortcode = '[attachment id="' + attId + '"]'

			if ( fieldValue.length > 0 ) {
				fieldValue += "\n\n"
			}

			fieldValue += shortcode + "\n\n"
			newFieldForAttachment[ attFieldName ] = fieldValue

			let newStateForAttachment = Object.assign( {}, state )
			newStateForAttachment[ formId ] = newFieldForAttachment

			return newStateForAttachment

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
