import React, { Component } from 'react';
import ProblemStatsContainer from '../containers/ProblemStatsContainer'
import ProblemSummary from '../components/ProblemSummary'
import QuestionFormContainer from '../containers/QuestionFormContainer'
import QuestionList from '../components/QuestionList'

export default class Problem extends Component {
	componentWillMount() {
		const { onComponentWillMount } = this.props
		const { problemId } = this.props
		onComponentWillMount( problemId )
	}

	render() {
		const { problems, problemId, questionsById, userCanAskQuestion } = this.props

		const problem = problems[problemId]

		const questionFormElement = userCanAskQuestion ? <QuestionFormContainer problemId={problemId} /> : ''

		return (
			<div className="ww-problem">
				<div className="problem-topmatter">
					<ProblemStatsContainer />
					<ProblemSummary problemId={problemId} problem={problem} />
				</div>

				{questionFormElement}

				<QuestionList questionsById={questionsById} />
			</div>
		);
	}
}
