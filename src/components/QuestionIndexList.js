import React, { Component } from 'react';
import QuestionContainer from '../containers/QuestionContainer.js'

export default class QuestionList extends Component {
	componentWillMount() {
		const { initialLoadComplete, onComponentWillMount } = this.props

		if ( initialLoadComplete ) {
			return
		}

		onComponentWillMount()
	}

	render() {
		const { isLoading, questionIds } = this.props

		let listItems = []
		questionIds.forEach( function( questionId ) {
			listItems.push(
			  <QuestionContainer
			    itemId={questionId}
			    key={questionId}
			  />
			)
		} )

		if ( ! listItems.length && ! isLoading ) {
			listItems.push( <p key="1" className="no-results">No results found.</p> )
		}

		return (
			<ul className="question-list">
				{listItems}
			</ul>
		)
	}
}
