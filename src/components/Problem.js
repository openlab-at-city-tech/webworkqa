import React, { Component } from 'react';
import ProblemStatsContainer from '../containers/ProblemStatsContainer'
import ProblemSummary from '../components/ProblemSummary'
import QuestionFormContainer from '../containers/QuestionFormContainer'
import QuestionList from '../components/QuestionList'

export default class Problem extends Component {
	componentDidMount() {
		const { onComponentDidMount, problemId } = this.props
		onComponentDidMount( problemId )
	}

	render() {
		const { problem, questionsById } = this.props

		return (
			<div className="ww-problem">
				<h2>{problem.title}</h2>
				<ProblemStatsContainer />
				<ProblemSummary content={problem.content} />

				<QuestionFormContainer problemId={problem.ID} />
				<QuestionList questionsById={questionsById} />
			</div>
		);
	}
}
