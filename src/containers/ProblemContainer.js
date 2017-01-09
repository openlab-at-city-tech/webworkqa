import { connect } from 'react-redux'
import Problem from '../components/Problem'
import { setAppIsLoading } from '../actions/app'
import { fetchProblem } from '../actions/problems'

const mapStateToProps = ( state, ownProps ) => {
	const { initialLoadComplete, problems, questions, questionsById, responseIdMap, responses } = state

	// @todo - All of this should be moved out so it doesn't run on every state update
	const questionCount = questionsById.length

	let responseCount = 0
	for ( var questionId in responseIdMap ) {
		if ( responseIdMap.hasOwnProperty( questionId ) ) {
			responseCount += responseIdMap[questionId].length
		}
	}

	let answered = {}
	for ( var responseId in responses ) {
		if ( responses.hasOwnProperty( responseId ) ) {
			// Will be overwritten for other responses to same question
			answered[ responses[responseId].questionId ] = responseId
		}
	}

	let answeredCount = 0
	for ( var questionId in answered ) {
		if ( answered.hasOwnProperty( questionId ) ) {
			answeredCount++
		}
	}

	const unansweredCount = questionsById.length - answeredCount
	const userCanAskQuestion = window.WWData.user_can_ask_question

	return {
		initialLoadComplete,
		problems,
		questionCount,
		questions,
		questionsById,
		responseCount,
		unansweredCount,
		userCanAskQuestion
	}
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onComponentWillMount: function( problemId ) {
			dispatch( setAppIsLoading( true ) )
			dispatch( fetchProblem( problemId ) )
		}
	}
}

const ProblemContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Problem)

export default ProblemContainer
