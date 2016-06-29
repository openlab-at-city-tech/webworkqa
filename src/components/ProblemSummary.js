import React from 'react';
import FormattedProblem from './FormattedProblem'

var ProblemSummary = React.createClass({
	render: function() {
		const { problemId } = this.props
		const { content, excerpt, inputs, maths } = this.props.problem

		return (
			<div className="ww-problem-summary">
				<FormattedProblem
				  problemId={problemId}
				  content={content}
				  excerpt={excerpt}
				  inputs={inputs}
				  maths={maths}
				/>
			</div>
		);
	}
});

export default ProblemSummary;
