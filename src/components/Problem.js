import React, { Component } from 'react';
import ProblemStatsContainer from '../containers/ProblemStatsContainer'
import ProblemSummary from '../components/ProblemSummary'
import QuestionFormContainer from '../containers/QuestionFormContainer'
import QuestionSortDropdownContainer from '../containers/QuestionSortDropdownContainer'
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
				<h2 className="ww-header ww-header-lowercase">Another Math Problem</h2>

				<div className="problem-topmatter">
					<ProblemStatsContainer />
					<ProblemSummary problemId={problemId} problem={problem} />
				</div>

				{questionFormElement}

				<div className="problem-questions">
					<QuestionSortDropdownContainer
					  itemType='problem'
					  problemId={problemId}
					/>
					<QuestionList questionsById={questionsById} />
				</div>
			</div>
		);
	}
}
