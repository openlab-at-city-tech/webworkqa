import { connect } from 'react-redux'
import QuestionIndex from '../components/QuestionIndex'

const mapStateToProps = ( state, ownProps ) => {
	const { viewType } = state

	return {
		isResultsPage: viewType.viewType == 'results'
	}
}

const QuestionIndexContainer = connect(
	mapStateToProps
)(QuestionIndex)

export default QuestionIndexContainer
