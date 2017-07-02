import { TOGGLE_EDITING } from '../actions/app'

export function editing( state = {}, action ) {
	switch ( action.type ) {
		case TOGGLE_EDITING :
			const { itemId } = action.payload

			let newState = Object.assign( {}, state )

			if ( state.hasOwnProperty( itemId ) ) {
				delete newState[ itemId ]
			} else {
				newState[ itemId ] = 1
			}

			return newState

		default :
			return state
	}
}
