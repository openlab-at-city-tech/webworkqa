import React, { Component } from 'react';
import { Link } from 'react-router'
import LaTeX from './LaTeX'

export default class ProblemListItem extends Component {
	componentDidMount() {

	}

	render() {
		const { problemId, content, excerpt, maths } = this.props

		const parts = content.split( /(\{\{\{math_[0-9]?\}\}\})/g)
		let children = []
		var num, theMath
		for ( var i = 0; i < parts.length; i++ ) {
			var num = parts[i].match( /\{\{\{math_([0-9]?)\}\}\}/ )
			if ( num ) {
				num = parseInt( num[1] )

				theMath = maths[num]
				children.push( <LaTeX key={i} math={theMath.math} display={theMath.display} /> )
			} else {
				children.push( <span key={i}>{parts[i]}</span> )
			}
		}

		return (
			<Link to={`/wpmaster/foo1/webwork/problems/${problemId}`}>
				<li className="problem-list-item">
					{children}
				</li>
			</Link>
		)
	}
}
