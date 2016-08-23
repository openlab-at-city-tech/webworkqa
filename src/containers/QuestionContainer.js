import { connect } from 'react-redux'
import Question from '../components/Question'
import { setCollapsed } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const {
		collapsed, initialLoadComplete,
		questions, responseIdMap, responses, viewType
	} = state

	const { itemId } = ownProps

	const isCollapsed = collapsed.hasOwnProperty( itemId )
	const isProblemSummaryCollapsed = collapsed.hasOwnProperty( itemId + '-problem' )

	const question = questions[itemId]
	const responseIds = responseIdMap.hasOwnProperty( itemId ) ? responseIdMap[itemId] : []

	const isSingleProblem = viewType.viewType == 'problem'
	const isCurrentQuestion = ( isSingleProblem && viewType.objectId == itemId )

	const routeBase = window.WWData.route_base
	const questionLink = '/'
		+ routeBase + '#/problem/'
		+ question.problemId + '/question-'
		+ itemId

	return {
		initialLoadComplete,
		isCollapsed,
		isProblemSummaryCollapsed,
		isCurrentQuestion,
		isSingleProblem,
		question,
		questionLink,
		responseIds,
		responses,
		userCanPostResponse: window.WWData.user_can_post_response > 0
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { itemId } = ownProps

	return {
		onAccordionClick: () => {
			dispatch( setCollapsed( itemId ) )
		},

		onProblemSummaryClick: () => {
			dispatch( setCollapsed( itemId + '-problem' ) )
		},

		onRespondClick: () => {
			dispatch( setCollapsed( 'responseForm-' + itemId, false ) )
		}
	}
}

const QuestionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Question)

export default QuestionContainer
