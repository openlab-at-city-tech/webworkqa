import React from 'react';
import FormattedProblem from './FormattedProblem'

var ProblemSummary = React.createClass({
	render: function() {
		const { problemId, problem } = this.props

		if ( ! problem ) {
			return (
				<div className="ww-problem-summary"></div>
			)
		}

		const { content, libraryId, maths } = problem
		const nbsp = '\u00a0'

		return (
			<div className="ww-problem-summary">
				<FormattedProblem
				  itemId={problemId}
				  content={content}
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
});

export default ProblemSummary;
