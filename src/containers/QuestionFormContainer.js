import { connect } from 'react-redux'
import QuestionForm from '../components/QuestionForm'
import { changeQuestionText, sendQuestion, setQuestionPending } from '../actions'

const mapStateToProps = (state, ownProps) => {
	const { content, tried, isPending } = state.questionFormData

	return {
		content,
		isPending,
		tried
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onTextareaChange: ( fieldName, value ) => {
			dispatch( changeQuestionText( fieldName, value ) )
		},

		onQuestionFormSubmit: ( e, content, tried ) => {
			e.preventDefault()
			dispatch( setQuestionPending( true ) )
			//dispatch( sendQuestion( ownProps.problemId, content, tried ) )
		}
	}
}

const QuestionFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionForm)

export default QuestionFormContainer
