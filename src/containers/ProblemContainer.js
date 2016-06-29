import { connect } from 'react-redux'
import Problem from '../components/Problem'
import { fetchProblem, setAppIsLoading } from '../actions'

const mapStateToProps = ( state, ownProps ) => {
	const { problems, questions, questionsById, responseIdMap, responses } = state

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

	return {
		problems,
		questionCount,
		questions,
		questionsById,
		responseCount,
		unansweredCount
	}
}

const mapDispatchToProps = ( dispatch ) => {
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
