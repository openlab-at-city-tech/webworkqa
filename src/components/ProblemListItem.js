import React, { Component } from 'react';
import { Link } from 'react-router'
import FormattedProblem from './FormattedProblem'

export default class ProblemListItem extends Component {
	render() {
		const { counter, problem } = this.props

		if ( ! problem ) {
			return ( <span></span> )
		}

		const { problemId, content, excerpt, inputs, maths } = problem

		return (
			<Link to={`/wpmaster/foo1/webwork/problems/${problemId}`}>
				<li className="problem-list-item">
					<h3>Problem {counter}</h3>
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
