import React from 'react'
import QuestionContainer from '../containers/QuestionContainer'

var QuestionList = React.createClass({
	render: function() {
		const { questionsById } = this.props

		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};
		var rows = []

		questionsById.forEach(function(questionId) {
			rows.push( <QuestionContainer
					itemId={questionId}
					key={questionId}
					/> );
		});
		return (
			<div className="ww-question-list">
				<h3>Questions / Responses</h3>
				<p className="ww-question-gloss">
					NOTE: values may be different than those presented in your problem.
				</p>
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
});

export default QuestionList
