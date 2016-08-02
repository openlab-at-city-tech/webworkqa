import { connect } from 'react-redux'
import ResultsHeader from '../components/ResultsHeader'

const mapStateToProps = ( state, ownProps ) => {
	const { currentFilters } = state

	return {
		currentFilters: currentFilters
	}
}

const ResultsHeaderContainer = connect(
	mapStateToProps
)(ResultsHeader)

export default ResultsHeaderContainer
