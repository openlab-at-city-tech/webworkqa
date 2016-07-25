import React, { Component } from 'react';
import QuestionListItemContainer from '../containers/QuestionListItemContainer.js'

export default class QuestionList extends Component {
	componentWillMount() {
		const { onComponentWillMount } = this.props
		onComponentWillMount()
	}

	render() {
		const { problemIds } = this.props

		let listItems = []
		problemIds.forEach( function( problemId ) {
			listItems.push(
			  <QuestionListItemContainer
			    problemId={problemId}
			    key={problemId}
			  />
			)
		} )

		return (
			<ul className="problem-list">
				{listItems}
			</ul>
		)
	}
}
