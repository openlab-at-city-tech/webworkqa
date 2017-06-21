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
		let alreadyListed = {} // Hack to work around dupes.
		questionIds.forEach( function( questionId ) {
			if ( alreadyListed.hasOwnProperty( questionId ) ) {
				return;
			}

			listItems.push(
			  <QuestionContainer
			    itemId={questionId}
			    key={questionId}
			  />
			)

			alreadyListed[ questionId ] = 1
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
