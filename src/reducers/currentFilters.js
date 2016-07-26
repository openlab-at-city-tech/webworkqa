import { SET_FILTER_TOGGLE } from '../actions/app'

export function currentFilters( state = {
	answeredQuestions: false,
	unansweredQuestions: false,

	orderby: 'post_date',
	order: 'DESC'
}, action ) {
	switch ( action.type ) {
		case SET_FILTER_TOGGLE :
			const { slug, value } = action.payload

			return Object.assign( {}, state, {
				[ slug ]: value,
			} )

		default :
			return state
	}
}

