import React, { Component } from 'react';
import ProblemStatsContainer from '../containers/ProblemStatsContainer'
import ProblemSummary from '../components/ProblemSummary'
import QuestionFormContainer from '../containers/QuestionFormContainer'
import QuestionList from '../components/QuestionList'

export default class Problem extends Component {
	componentWillMount() {
		const { onComponentWillMount } = this.props
		const { problemId } = this.props.routeParams
		onComponentWillMount( problemId )
	}

	render() {
		const { problem, questionsById } = this.props

		const problemId = problem.ID

		// Maintain minimum height.
		const title = problem.title.length ? problem.title : '\u0020'

		return (
			<div className="ww-problem">
				<h2>{title}</h2>
				<ProblemStatsContainer />
				<ProblemSummary problemId={problemId} problem={problem} />

				<QuestionFormContainer problemId={problem.ID} />
				<QuestionList questionsById={questionsById} />
			</div>
		);
	}
}
