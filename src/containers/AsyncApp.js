import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchProblem } from '../actions'
import ProblemSummary from '../components/ProblemSummary'
import AskQuestion from '../components/AskQuestion'
import QuestionList from '../components/QuestionList'
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
		const { collapsed, problem, isFetching, didInvalidate, questions, questionsById, scores, votes } = this.props

		return (
			<div className="ww-problem">
				<h2>{problem.title}</h2>
				<ProblemSummary content={problem.content} />

				<AskQuestion problem_id={problem.ID} />
				<QuestionList
					collapsed={collapsed}
					handleToggleVote={this.handleToggleVote}
					problem_id={problem.ID}
					questions={questions}
					questionsById={questionsById}
					scores={scores}
					votes={votes}
					/>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const { collapsed, problem, questions, questionsById, scores, votes } = state

	return {
		collapsed,
		problem,
		questions,
		questionsById,
		scores,
		votes
	}
}

export default connect( mapStateToProps )( AsyncApp )
