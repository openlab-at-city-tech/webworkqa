import React, { Component } from 'react';
import { Link } from 'react-router'
import FormattedProblem from './FormattedProblem'

export default class QuestionListItem extends Component {
	render() {
		const { question } = this.props

		if ( ! question ) {
			return ( <span></span> )
		}

		const { problemId, questionId, problemText, excerpt, problemInputs, problemMaths, instances } = question
		const remoteCourseURL = window.WWData.remote_course_url

		let instance = null
		let title = ''
		if ( instances && instances.hasOwnProperty( remoteCourseURL ) ) {
			const { remoteProblemURL, remoteProblemSet, remoteProblem } = instances[ remoteCourseURL ]
			title = 'Problem Set ' + remoteProblemSet + ', Problem ' + remoteProblem
		}

		const routeBase = window.WWData.route_base
		const routePath = '/' + routeBase + 'problems/' + problemId

		return (
			<Link to={routePath}>
				<h3>{title}</h3>
				<li className="question-list-item">
					<FormattedProblem
					  itemId={questionId}
					  problemId={problemId}
					  content={problemText}
					  excerpt={excerpt}
					  inputs={problemInputs}
					  maths={problemMaths}
					/>
				</li>
			</Link>
		)
	}
}
