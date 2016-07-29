import React, { Component } from 'react';
import FormattedProblem from './FormattedProblem'

export default class QuestionListItem extends Component {
	render() {
		const { question } = this.props

		if ( ! question ) {
			return ( <span></span> )
		}

		const { problemId, questionId, problemText, excerpt, problemMaths, instances } = question
		const remoteCourseURL = window.WWData.remote_course_url

		let instance = null
		let title = ''
		if ( instances && instances.hasOwnProperty( remoteCourseURL ) ) {
			const { remoteProblemURL, remoteProblemSet, remoteProblem } = instances[ remoteCourseURL ]
			title = 'Problem Set ' + remoteProblemSet + ', Problem ' + remoteProblem
		}

		const routeBase = window.WWData.route_base
		const questionLink = '/' + routeBase + '#/problem/' + problemId + '/question-' + questionId

		return (
			<a href={questionLink}>
				<h3>{title}</h3>
				<li className="question-list-item">
					<FormattedProblem
					  itemId={questionId}
					  problemId={problemId}
					  content={problemText}
					  excerpt={excerpt}
					  maths={problemMaths}
					/>
				</li>
			</a>
		)
	}
}
