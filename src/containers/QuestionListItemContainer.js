import { connect } from 'react-redux'
import QuestionListItem from '../components/QuestionListItem'

const mapStateToProps = ( state, ownProps ) => {
	const { questions } = state
	const { questionId } = ownProps

	const question = questions[ questionId ]

	return {
		question
	}
}

const QuestionListItemContainer = connect(
	mapStateToProps
)(QuestionListItem)

export default QuestionListItemContainer
