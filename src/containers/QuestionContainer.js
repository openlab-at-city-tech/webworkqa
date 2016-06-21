import { connect } from 'react-redux'
import Question from '../components/Question'
import { toggleAccordion } from '../actions'

const mapStateToProps = (state) => {
	const { answered, collapsed, responseIdMap, responses } = state

	return {
		answered,
		collapsed,
		responseIdMap,
		responses
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
