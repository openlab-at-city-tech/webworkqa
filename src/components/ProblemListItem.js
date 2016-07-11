import React, { Component } from 'react';
import { Link } from 'react-router'
import FormattedProblem from './FormattedProblem'

export default class ProblemListItem extends Component {
	render() {
		const { problem } = this.props

		if ( ! problem ) {
			return ( <span></span> )
		}

		const { problemId, content, excerpt, inputs, maths, instances } = problem
		const remoteCourseURL = window.WWData.remote_course_url

		let instance = null
		let title = ''
		if ( instances.hasOwnProperty( remoteCourseURL ) ) {
			const { remoteProblemURL, remoteProblemSet, remoteProblem } = instances[ remoteCourseURL ]
			title = 'Problem Set ' + remoteProblemSet + ', Problem ' + remoteProblem
		}



		return (
			<Link to={`/wpmaster/foo1/webwork/problems/${problemId}`}>
				<h3>{title}</h3>
				<li className="problem-list-item">
					<FormattedProblem
					  itemId={problemId}
					  content={content}
					  excerpt={excerpt}
					  inputs={inputs}
					  maths={maths}
					/>
				</li>
			</Link>
		)
	}
}
