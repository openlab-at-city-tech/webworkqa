import { RECEIVE_RESPONSE, RECEIVE_RESPONSES, REMOVE_RESPONSE, SET_RESPONSE_ANSWERED } from '../actions/responses'

export function responses( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSE :
			return Object.assign( {}, state, {
				[action.payload.responseId]: action.payload
			} )

		case RECEIVE_RESPONSES :
			return action.payload

		case REMOVE_RESPONSE :
			let newResponses = Object.assign( {}, state )
			delete( newResponses[ action.payload.responseId ] )
			return newResponses

		case SET_RESPONSE_ANSWERED :
			const { responseId, isAnswered } = action.payload

			const newResponse = Object.assign( {}, state[responseId], {
				isAnswer: isAnswered
			} )

			return Object.assign( {}, state, {
				[responseId]: newResponse
			} )
		default :
			return state
	}
}
