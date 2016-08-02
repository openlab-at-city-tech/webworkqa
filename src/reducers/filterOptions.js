import { RECEIVE_FILTER_OPTIONS } from '../actions/app'

export function filterOptions( state = {
	course: [],
	section: [],
	problemSet: [],
	unansweredQuestions: [],
	answeredQuestions: []
}, action ) {
	switch ( action.type ) {
		case RECEIVE_FILTER_OPTIONS :
			return action.payload

		default :
			return state
	}
}
