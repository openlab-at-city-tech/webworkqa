import React, { Component } from 'react';
import { Link } from 'react-router'

export default class ProblemListItem extends Component {
	render() {
		const { problemId } = this.props
		return (
			<li>
				<Link to={`/wpmaster/foo1/webwork/problems/${problemId}`}>Here is a problem link</Link>
			</li>
		)
	}
}
