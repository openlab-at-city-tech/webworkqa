import { SET_VIEW_TYPE } from '../actions/app'

export function viewType( state = {
	viewType: '',
	objectId: ''
}, action ) {
	switch ( action.type ) {
		case SET_VIEW_TYPE :
			const { viewType, objectId } = action.payload

			return Object.assign( {}, state, {
				viewType,
				objectId
			} )

		default :
			return state
	}
}
