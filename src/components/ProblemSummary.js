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

		const { content, inputs, libraryId, maths } = problem

		return (
			<div className="ww-problem-summary">
				<FormattedProblem
				  problemId={problemId}
				  content={content}
				  inputs={inputs}
				  maths={maths}
				/>

				<div className="problem-library-id">
					Problem ID: {libraryId}
				</div>
			</div>
		);
	}
});

export default ProblemSummary;
