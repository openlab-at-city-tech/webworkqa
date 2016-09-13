import { connect } from 'react-redux'
import QuestionForm from '../components/QuestionForm'
import { sendQuestion, setQuestionPending } from '../actions/questions'
import { setCollapsed } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const { collapsed, formData } = state
	const { content, tried, isPending } = formData

	const problemText = window.WWData.problem_text
	const isCollapsed = collapsed.hasOwnProperty( 'questionForm' )

	return {
		content,
		isCollapsed,
		isPending,
		problemText,
		tried
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onAccordionClick: () => {
			dispatch( setCollapsed( 'questionForm' ) )
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
