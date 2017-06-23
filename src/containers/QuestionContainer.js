import { connect } from 'react-redux'
import Question from '../components/Question'
import { setCollapsed } from '../actions/app'
import { setScrolledTo } from '../actions/questions'
import { getCurrentView } from '../util/webwork-url-parser'

const mapStateToProps = (state, ownProps) => {
	const {
		collapsed, initialLoadComplete,
		questions, responseIdMap, responses, routing
	} = state

	const { itemId } = ownProps

	const currentView = getCurrentView( routing )

	const isCollapsed = collapsed.hasOwnProperty( itemId )
	const isProblemSummaryCollapsed = collapsed.hasOwnProperty( itemId + '-problem' )

	const question = questions[itemId]
	const responseIds = responseIdMap.hasOwnProperty( itemId ) ? responseIdMap[itemId] : []

	const isSingleProblem = currentView.hasOwnProperty( 'problemId' )
	const isQuestionAnchor = currentView.hasOwnProperty( 'questionId' )
	const isCurrentQuestion = ( isSingleProblem && isQuestionAnchor && currentView.questionId == itemId )

	const routeBase = window.WWData.route_base
	const questionLink = '/'
		+ routeBase + '#:problemId='
		+ question.problemId + ':questionId='
		+ itemId

	let questionStatus = 'unanswered'
	if ( question.hasAnswer ) {
		questionStatus = 'answered'
	} else if ( question.responseCount > 0 ) {
		questionStatus = 'in-progress'
	}

	return {
		initialLoadComplete,
		isCollapsed,
		isProblemSummaryCollapsed,
		isCurrentQuestion,
		isSingleProblem,
		question,
		questionLink,
		questionStatus,
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

		onProblemSummaryClick: ( event ) => {
			// Don't close for clickable elements.
			const clickable = {
				SELECT: 1,
				OPTION: 1,
				A: 1,
			}

			if ( clickable.hasOwnProperty( event.target.tagName ) ) {
				return
			}

			dispatch( setCollapsed( itemId + '-problem' ) )
		},

		onRespondClick: () => {
			dispatch( setCollapsed( 'responseForm-' + itemId, false ) )
		},

		onWaypointEnter: () => {
			dispatch( setScrolledTo( itemId ) )
		}
	}
}

const QuestionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Question)

export default QuestionContainer
