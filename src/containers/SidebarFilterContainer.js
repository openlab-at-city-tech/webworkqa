import { connect } from 'react-redux'
import SidebarFilter from '../components/SidebarFilter'
import { processFilterChange } from '../actions/app'
import { fetchQuestionIndexList } from '../actions/questions'

import { push } from 'react-router-redux'

const mapStateToProps = ( state, ownProps ) => {
	const { currentFilters, filterOptions } = state
	const { slug } = ownProps

	let options = filterOptions[ slug ]
	let value = currentFilters[ slug ]

	return {
		options,
		value
	}
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onFilterChange: function( selected ) {
			const { slug } = ownProps

			let value = ''
			if ( selected ) {
				value = selected.value
			}

			dispatch( processFilterChange( slug, value ) )

			// No
			// Instead of this:
			// - Trigger a filter change
			// - In the corresponding reducer, modify the 'routing' state
			// - This should automatically trigger a location change because of react-router-redux
			// - Then, ensure that the list of questions is listening for changes to location
			// - Something like a componentWillReceiveProps that bails if location is not change
			// - that method will trigger an AJAX request
			dispatch( push( '#:great=bar' ) )

			// I need to dispatch to a thunk in order to trigger a question
			// lookup based on current filters
			// A thunk takes getState as a parameter

			return

			// For the theme to know when to collapse the menu.
			const event = new Event( 'webworkFilterChange' );
			document.body.dispatchEvent( event );
		}
	}
}

const SidebarFilterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SidebarFilter)

export default SidebarFilterContainer
