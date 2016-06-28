import { connect } from 'react-redux'
import ProblemList from '../components/ProblemList'
import { fetchProblems } from '../actions'

const mapStateToProps = ( state ) => {
	const { problemIds } = state

	return {
		problemIds
	}
}

const mapDispatchToProps = ( dispatch ) => {
	return {
		// @todo Pagination?
		onComponentDidMount: function() {
			dispatch( fetchProblems() )
		}
	}
}

const ProblemListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ProblemList)

export default ProblemListContainer
