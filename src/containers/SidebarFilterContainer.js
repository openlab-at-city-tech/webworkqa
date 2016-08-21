import { connect } from 'react-redux'
import SidebarFilter from '../components/SidebarFilter'
import { processFilterToggle, processFilterChange } from '../actions/app'
import { fetchQuestionIndexList } from '../actions/questions'

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
		onFilterChange: function( event ) {
			const { slug } = ownProps
			const { value } = event.target

			dispatch( processFilterChange( slug, value ) )
		}
	}
}

const SidebarFilterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SidebarFilter)

export default SidebarFilterContainer
