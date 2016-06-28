import React, { Component } from 'react';
import { Link } from 'react-router'

export default class ProblemListItem extends Component {
	render() {
		const { problemId, excerpt } = this.props
		return (
			<Link to={`/wpmaster/foo1/webwork/problems/${problemId}`}>
				<li className="problem-list-item">
					{excerpt}
				</li>
			</Link>
		)
	}
}
