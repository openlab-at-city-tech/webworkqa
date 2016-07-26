import { RECEIVE_RESPONSE_ID_FOR_MAP, RECEIVE_RESPONSE_ID_MAP } from '../actions/responses'

export function responseIdMap( state = {}, action ) {
	switch ( action.type ) {
		case RECEIVE_RESPONSE_ID_FOR_MAP :
			const { questionId, responseId } = action.payload

			let questionResponseIds = []
			if ( state.hasOwnProperty( questionId ) ) {
				// Clone the original array to avoid reference problems.
				questionResponseIds = state[questionId].slice(0)
				questionResponseIds.push( responseId )
			} else {
				questionResponseIds.push( responseId )
			}

			return Object.assign( {}, state, {
				[questionId]: questionResponseIds
			} )

		case RECEIVE_RESPONSE_ID_MAP :
			return action.payload

		default :
			return state
	}
}
