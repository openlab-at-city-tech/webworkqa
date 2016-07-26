import { TOGGLE_ACCORDION } from '../actions/app'

export function collapsed( state = {}, action ) {
	switch ( action.type ) {
		case TOGGLE_ACCORDION :
			const { itemId } = action.payload
			if ( state.hasOwnProperty( itemId ) ) {
				let newState = Object.assign( {}, state )
				delete newState[ itemId ]
				return newState
			} else {
				return Object.assign( {}, state, {
					[itemId]: '1'
				} )
			}
		default :
			return state
	}
}

