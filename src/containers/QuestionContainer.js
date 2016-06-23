import { connect } from 'react-redux'
import Question from '../components/Question'
import { toggleAccordion } from '../actions'

const mapStateToProps = (state, ownProps) => {
	const { answered, collapsed, responseIdMap, responses } = state
	const { itemId } = ownProps

	const isCollapsed = collapsed.hasOwnProperty( itemId )

	let isAnswered = false
	if ( responseIdMap.hasOwnProperty( itemId ) ) {
		for ( var i = 0; i <= responseIdMap[ itemId ].length; i++ ) {
			if ( answered.hasOwnProperty( responseIdMap[ itemId ][ i ] ) ) {
				isAnswered = true
				break
			}
		}
	}

	const responseIds = responseIdMap.hasOwnProperty( itemId ) ? responseIdMap[itemId] : []

	return {
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
