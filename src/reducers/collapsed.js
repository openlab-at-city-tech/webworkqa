import { SET_COLLAPSED, SET_COLLAPSED_BULK } from '../actions/app'

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

		case SET_COLLAPSED_BULK :
			let newState = Object.assign( {}, state )
			const items = action.payload

			for ( let i = 0; i < items.length; i++ ) {
				if ( items[ i ].value ) {
					newState[ items[ i ].key ] = '1'
				} else if ( newState.hasOwnProperty( items[ i ].key ) ) {
					delete newState[ items[ i ].key ]
				}
			}

			return newState

		default :
			return state
	}
}

