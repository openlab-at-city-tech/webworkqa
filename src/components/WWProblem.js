import React from 'react';
import WWProblemSummary from './WWProblemSummary';
import WWAskQuestion from './WWAskQuestion';
import WWQuestionList from './WWQuestionList';

var WWProblem = React.createClass({
	render: function() {
		return (
			<div className="ww-problem">
				<h2>{this.props.problem_data.title}</h2>
				<WWProblemSummary content={this.props.problem_data.summary} />

				<WWAskQuestion problem_id={this.props.problem_data.id} />

				<WWQuestionList problem_id={this.props.problem_data.id} questions={this.props.problem_data.questions} />
			</div>
		);
	}
});

export default WWProblem;
