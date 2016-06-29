import React, { Component } from 'react';
import { Link } from 'react-router'
import FormattedProblem from './FormattedProblem'

export default class ProblemListItem extends Component {
	render() {
		const { problemId, content, excerpt, inputs, maths } = this.props

		return (
			<Link to={`/wpmaster/foo1/webwork/problems/${problemId}`}>
				<li className="problem-list-item">
					<FormattedProblem
					  problemId={problemId}
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
