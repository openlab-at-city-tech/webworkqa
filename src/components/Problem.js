import React, { Component } from 'react';
import ProblemSummary from '../components/ProblemSummary'
import QuestionFormContainer from '../containers/QuestionFormContainer'
import QuestionList from '../components/QuestionList'

export default class Problem extends Component {
	componentDidMount() {
		const { onComponentDidMount, problemId } = this.props
		onComponentDidMount( problemId )
	}

	componentWillReceiveNewProps( nextProps ) {
		console.log( 'Receiving new props' )
		console.log( nextProps )
	}

	render() {
		const { problem, questions, questionsById } = this.props

		return (
			<div className="ww-problem">
				<h2>{problem.title}</h2>
				<ProblemSummary content={problem.content} />

				<QuestionFormContainer problemId={problem.ID} />
				<QuestionList
				  problem_id={problem.ID}
				  questions={questions}
				  questionsById={questionsById}
				/>
			</div>
		);
	}
}
