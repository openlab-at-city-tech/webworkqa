import { connect } from 'react-redux'
import QuestionListItem from '../components/QuestionListItem'

const mapStateToProps = ( state, ownProps ) => {
	const { problems } = state
	const { problemId } = ownProps

	const problem = problems[ problemId ]

	return {
		problem
	}
}

const QuestionListItemContainer = connect(
	mapStateToProps
)(QuestionListItem)

export default QuestionListItemContainer
