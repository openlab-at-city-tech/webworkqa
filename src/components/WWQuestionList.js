import React from 'react';
import WWQuestion from './WWQuestion';

var WWQuestionList = React.createClass({
	render: function() {
		const { questions, questionsById } = this.props

		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};
		var rows = []

		questionsById.forEach(function(questionId) {
			if ( questions.hasOwnProperty( questionId ) ) {
				rows.push( <WWQuestion key={questionId} question={questions[questionId]} /> );
			}
		});
		return (
			<div className="ww-question-list">
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
});

export default WWQuestionList;
