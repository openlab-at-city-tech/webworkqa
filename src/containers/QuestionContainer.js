import { connect } from 'react-redux'
import Question from '../components/Question'
import { toggleAccordion } from '../actions'

const mapStateToProps = (state, ownProps) => {
	const { collapsed, initialLoadComplete, responseIdMap, responses } = state
	const { itemId } = ownProps

	const isCollapsed = collapsed.hasOwnProperty( itemId )

	const responseIds = responseIdMap.hasOwnProperty( itemId ) ? responseIdMap[itemId] : []

	let isAnswered = false
	let responseId = 0
	let response = null
	if ( responseIds.length ) {
		for ( var i = 0; i <= responseIds.length; i++ ) {
			responseId = responseIds[i]
			response = responses[responseId]
			if ( response && response.isAnswer ) {
				isAnswered = true
				break
			}
		}
	}

	return {
		initialLoadComplete,
		isAnswered,
		isCollapsed,
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
