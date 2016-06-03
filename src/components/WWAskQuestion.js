import React from 'react';

var WWAskQuestion = React.createClass({
	render: function() {
		return (
			<div className="ww-ask-question-form">
				<form>
					<h3>Ask a Question</h3>
					<input type="hidden" name="ww-problem-id" value={this.props.problem_id} />
					<textarea name="ww-question-content" value="" />
					<input type="submit" value="Submit!" />
				</form>
			</div>
		);
	}
});

export default WWAskQuestion;
