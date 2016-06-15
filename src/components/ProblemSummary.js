import React from 'react';

var ProblemSummary = React.createClass({
	render: function() {
		return (
			<div className="ww-problem-summary">
				{this.props.content}
			</div>
		);
	}
});

export default ProblemSummary;
