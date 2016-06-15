import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProblem } from '../actions'
import WWProblemSummary from '../components/WWProblemSummary'
import WWAskQuestion from '../components/WWAskQuestion'
import WWQuestionList from '../components/WWQuestionList'
import { clickVote } from '../actions'

class AsyncApp extends Component {
	constructor( props ) {
		super( props )
		this.handleToggleVote = this.handleToggleVote.bind(this)
	}

	componentDidMount() {
		this.props.dispatch( fetchProblem( '101010104019' ) );
	}

	handleToggleVote( itemId, voteType ) {
		this.props.dispatch( clickVote( itemId, voteType ) );
	}

	render() {
		const { problem, isFetching, didInvalidate, questions, questionsById, scores, votes } = this.props

		return (
			<div className="ww-problem">
				<h2>{problem.title}</h2>
				<WWProblemSummary content={problem.content} />

				<WWAskQuestion problem_id={problem.ID} />
				<WWQuestionList
					problem_id={problem.ID}
					questions={questions}
					questionsById={questionsById}
					handleToggleVote={this.handleToggleVote}
					scores={scores}
					votes={votes}
					/>

			</div>
		);
	}
}

function mapStateToProps( state ) {
	const { problem, questions, questionsById, scores, votes } = state
//	const { problemData, isFetching, didInvalidate, questions, questionsById, scores, votes } = state.problem

	return {
		problem,
		questions,
		questionsById,
		scores,
		votes
	}
}

export default connect( mapStateToProps )( AsyncApp )
