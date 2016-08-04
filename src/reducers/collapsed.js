import { SET_COLLAPSED } from '../actions/app'

export function collapsed( state = {}, action ) {
	switch ( action.type ) {
		case SET_COLLAPSED :
			const { itemId, value } = action.payload

			let doCollapse
			if ( null === value ) {
				doCollapse = ! state.hasOwnProperty( itemId )
			} else {
				doCollapse = true
			}

			if ( doCollapse ) {
				return Object.assign( {}, state, {
					[itemId]: '1'
				} )
			} else {
				let newState = Object.assign( {}, state )
				delete newState[ itemId ]
				return newState
			}
		default :
			return state
	}
}

