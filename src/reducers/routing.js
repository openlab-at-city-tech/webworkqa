import { LOCATION_CHANGE } from 'react-router-redux';
import { SET_FILTER_TOGGLE } from '../actions/app';

// This initial state is *copied* from react-router-redux's
// routerReducer (the property name 'locationBeforeTransitions' is
// because this is designed for use with react-router)
const initialState = { locationBeforeTransitions: null };

export function routing( state = initialState, action ) {
	switch ( action.type ) {

		// This LOCATION_CHANGE case is copied from react-router-redux's routerReducer
		case LOCATION_CHANGE :
			return state
/*			return { ...state, locationBeforeTransitions: action.payload } */

		// Here is our code to set the location state when the user chooses
		// a different option in the menu
		case SET_FILTER_TOGGLE :
			let location = state.locationBeforeTransitions;
			console.log('setting toggle')
			console.log(location)
			const pathname = '/fresh/'
			/*location = { ...location, pathname, action: 'PUSH' } */
			return state
/*			return { ...state, locationBeforeTransitions: location } */
			/*
			const pathname = `/redux-history-demo/${name}`;
			location = { ...location, pathname, action: 'PUSH' };
			return { ...state, locationBeforeTransitions: location };
			*/

		default :
			return state
	
	}
}
