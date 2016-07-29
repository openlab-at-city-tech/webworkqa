import { connect } from 'react-redux'
import Question from '../components/Question'
import { toggleAccordion } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const {
		collapsed, currentQuestion, initialLoadComplete,
		questions, responseIdMap, responses
	} = state

	const { itemId } = ownProps

	const isCollapsed = collapsed.hasOwnProperty( itemId )

	const question = questions[itemId]
	const responseIds = responseIdMap.hasOwnProperty( itemId ) ? responseIdMap[itemId] : []

	const isCurrentQuestion = itemId == currentQuestion

	return {
		initialLoadComplete,
		isCollapsed,
		isCurrentQuestion,
		question,
		responseIds,
		responses,
		userCanPostResponse: window.WWData.user_can_post_response > 0
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAccordionClick: (itemId) => {
			dispatch( toggleAccordion( itemId ) )
		}
	}
}

const QuestionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Question)

export default QuestionContainer
