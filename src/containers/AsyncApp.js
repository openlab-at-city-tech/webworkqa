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
		const { problemData, isFetching, didInvalidate } = this.props.problem
		const { questions } = this.props

		return (
			<div className="ww-problem">
				<h2>{problemData.post_title}</h2>
				<WWProblemSummary content={problemData.post_content} />

				<WWAskQuestion problem_id={problemData.ID} />
				<WWQuestionList problem_id={problemData.ID} />

			</div>
		);
	}
}

/* questions={this.props.problem_data.questions} */

function mapStateToProps( state ) {
	const { problem } = state

	return {
		problem
	}
}

export default connect( mapStateToProps )( AsyncApp )
