import { connect } from 'react-redux'
import Problem from '../components/Problem'
import { fetchProblem } from '../actions'

const mapStateToProps = ( state ) => {
	const { problem, questions, questionsById } = state

	return {
		problem,
		questions,
		questionsById
	}
}

const mapDispatchToProps = ( dispatch ) => {
	return {
		onComponentDidMount: function( problemId ) {
			dispatch( fetchProblem( problemId ) )
		}
	}
}

const AsyncApp = connect(
	mapStateToProps,
	mapDispatchToProps
)(Problem)

export default AsyncApp
