import { connect } from 'react-redux'
import QuestionForm from '../components/QuestionForm'
import { changeQuestionText, sendQuestion, setQuestionPending } from '../actions/questions'

const mapStateToProps = (state, ownProps) => {
	const { content, tried, isPending } = state.questionFormData

	const problemText = window.WWData.problem_text

	return {
		content,
		isPending,
		problemText,
		tried
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onTextareaChange: ( fieldName, value ) => {
			dispatch( changeQuestionText( fieldName, value ) )
		},

		onQuestionFormSubmit: ( e, content, tried, problemText ) => {
			e.preventDefault()
			dispatch( setQuestionPending( true ) )
			dispatch( sendQuestion( ownProps.problemId, content, tried, problemText ) )
		}
	}
}

const QuestionFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionForm)

export default QuestionFormContainer
