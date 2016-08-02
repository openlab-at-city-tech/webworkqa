import React, { Component } from 'react'

export default class ResultsHeader extends Component {
	render() {
		const { currentFilters } = this.props

		const displayFilters = [ 'course', 'section', 'problemSet' ]

		let active = []
		let filterName = ''
		for ( let i = 0; i < displayFilters.length; i++ ) {
			filterName = displayFilters[ i ]
			if ( currentFilters[ filterName ] ) {
				active.push( currentFilters[ filterName ] )
			}
		}

		if ( currentFilters.unansweredQuestions ) {
			active.push( 'Unanswered' )
		} else if ( currentFilters.answeredQuestions ) {
			active.push( 'Answered' )
		}

		let breadcrumbs = ''
		if ( active.length ) {
			const crumbs = active.join( ' > ' )
			breadcrumbs = <div className="results-breadcrumbs">{crumbs}</div>
		}

		return (
			<div className="results-header">
				<h2>Questions</h2>
				{breadcrumbs}
			</div>
		)
	}
}
