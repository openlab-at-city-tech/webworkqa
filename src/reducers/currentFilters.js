import { SET_FILTER_TOGGLE, SET_SORT_ORDERBY } from '../actions/app'

export function currentFilters( state = {
	course: false,
	section: false,
	problemSet: false,
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

		case SET_SORT_ORDERBY :
			const { orderby, order } = action.payload

			return Object.assign( {}, state, {
				orderby,
				order
			} )

		default :
			return state
	}
}

