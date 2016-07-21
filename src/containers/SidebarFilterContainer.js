import { connect } from 'react-redux'
import SidebarFilter from '../components/SidebarFilter'
import { setFilterToggle } from '../actions'

const mapStateToProps = ( state, ownProps ) => {
	const { currentFilters } = state

	let value = currentFilters[ ownProps.slug ]

	return {
		value
	}
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onFilterHeaderClick: function() {
			const { contrary, slug, type } = ownProps

			switch ( type ) {
				case 'toggle' :
					dispatch( setFilterToggle( slug, contrary ) )
				break;

				default :
				break;
			}
		}
	}
}

const SidebarFilterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SidebarFilter)

export default SidebarFilterContainer
