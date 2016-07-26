import { RECEIVE_PROBLEM_IDS } from '../actions/problems'

export function problemIds( state = [], action ) {
	switch ( action.type ) {
		case RECEIVE_PROBLEM_IDS :
			return action.payload

		default :
			return state
	}
}
