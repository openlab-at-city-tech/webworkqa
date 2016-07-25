import { connect } from 'react-redux'
import QuestionIndexList from '../components/QuestionIndexList'
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
		onComponentWillMount: function() {
			dispatch( fetchProblems() )
		}
	}
}

const QuestionListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionIndexList)

export default QuestionListContainer
