import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProblem } from '../actions'
import WWProblemSummary from '../components/WWProblemSummary'
import WWAskQuestion from '../components/WWAskQuestion'
import WWQuestionList from '../components/WWQuestionList'

class AsyncApp extends Component {
	constructor( props ) {
		super( props )
	}

	componentDidMount() {
		this.props.dispatch( fetchProblem( '101010104019' ) );
	}

	render() {
		const { problemData, isFetching, didInvalidate, questions, questionsById } = this.props

		return (
			<div className="ww-problem">
				<h2>{problemData.title}</h2>
				<WWProblemSummary content={problemData.content} />

				<WWAskQuestion problem_id={problemData.ID} />
				<WWQuestionList problem_id={problemData.ID} questions={questions} questionsById={questionsById} />

			</div>
		);
	}
}

function mapStateToProps( state ) {
	const { problemData, isFetching, didInvalidate, questions, questionsById  } = state.problem

	return {
		problemData,
		isFetching,
		didInvalidate,
		questions,
		questionsById
	}
}

export default connect( mapStateToProps )( AsyncApp )
