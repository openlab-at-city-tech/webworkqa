import { SET_FILTER_TOGGLE } from '../actions/app'
import { LOCATION_CHANGE } from 'react-router-redux'
import { buildHashFromFilter } from '../util/webwork-url-parser'

// This initial state is *copied* from react-router-redux's
// routerReducer (the property name 'locationBeforeTransitions' is
// because this is designed for use with react-router)
const initialState = { locationBeforeTransitions: { hash: '' } };

export function routing( state = initialState, action ) {
	switch ( action.type ) {
		case LOCATION_CHANGE :
			return Object.assign( {}, state, {
				locationBeforeTransitions: action.payload
			} )

		// Here is our code to set the location state when the user chooses
		// a different option in the menu
		case SET_FILTER_TOGGLE :
			const { slug, value } = action.payload

			const newHash = buildHashFromFilter( slug, value, state )

			const newLocation = Object.assign( {}, location, {
				hash: newHash,
				action: 'PUSH'
			} )

			return Object.assign( {}, state, {
				locationBeforeTransitions: newLocation
			} )

		default :
			return state
	}
}
