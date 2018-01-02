import React, { Component } from 'react';
import FormattedProblem from './FormattedProblem'

export default class ProblemSummary extends Component {
	render() {
		const { problemId, problem } = this.props

		if ( ! problem ) {
			return (
				<div className="ww-problem-summary"></div>
			)
		}

		const { content, contentSwappedUrl, libraryId, maths } = problem
		const nbsp = '\u00a0'

		const itemId = problemId.split( '/' ).join( '-' )

		return (
			<div className="ww-problem-summary">
				<FormattedProblem
				  itemId={itemId}
				  content={content}
					contentSwappedUrl={contentSwappedUrl}
				  maths={maths}
				/>

				<div className="problem-library-id">
					<i
					  aria-hidden="true"
					  className="fa fa-folder-open problem-library-id-icon"
					></i>
					<div className="problem-library-id-text">
						ProblemID:{nbsp}{libraryId}
					</div>
				</div>
			</div>
		);
	}
}
