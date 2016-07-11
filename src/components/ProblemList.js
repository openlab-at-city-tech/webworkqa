import React, { Component } from 'react';
import ProblemListItemContainer from '../containers/ProblemListItemContainer.js'

export default class ProblemList extends Component {
	componentWillMount() {
		const { onComponentWillMount } = this.props
		onComponentWillMount()
	}

	render() {
		const { problemIds } = this.props

		let listItems = []
		let counter = 1
		problemIds.forEach( function( problemId ) {
			listItems.push(
			  <ProblemListItemContainer
			    problemId={problemId}
			    key={problemId}
			    counter={counter}
			  />
			)
			counter++
		} )

		return (
			<ul className="problem-list">
				{listItems}
			</ul>
		)
	}
}
