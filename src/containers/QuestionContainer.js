import { connect } from 'react-redux'
import Question from '../components/Question'
import { toggleAccordion } from '../actions'

const mapStateToProps = (state) => {
	const { answered, collapsed, responseIdMap, responses } = state

	return {
		answered,
		collapsed,
		responseIdMap,
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
