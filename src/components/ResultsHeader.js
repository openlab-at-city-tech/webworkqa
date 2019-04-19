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

		let breadcrumbs = ''
		if ( active.length ) {
			const crumbs = active.join( ' / ' )
			breadcrumbs = (
				<div className="results-breadcrumbs">
					<span className="results-breadcrumbs-label">Filtered by:</span> {crumbs}
				</div>
			)
		}

		return (
			<div className="results-header">
				<h2 className="ww-header">Questions</h2>
				{breadcrumbs}
			</div>
		)
	}
}
