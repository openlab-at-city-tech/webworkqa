import { connect } from 'react-redux'
import Question from '../components/Question'
import { toggleAccordion } from '../actions'

const mapStateToProps = (state, ownProps) => {
	const { collapsed, initialLoadComplete, questions, responseIdMap, responses } = state
	const { itemId } = ownProps

	const isCollapsed = collapsed.hasOwnProperty( itemId )

	const question = questions[itemId]
	const responseIds = responseIdMap.hasOwnProperty( itemId ) ? responseIdMap[itemId] : []

	return {
		initialLoadComplete,
		isCollapsed,
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
