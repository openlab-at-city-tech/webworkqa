import React from 'react';
import QuestionContainer from '../containers/QuestionContainer';

var QuestionList = React.createClass({
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
				rows.push( <QuestionContainer
						itemId={questionId}
						key={questionId}
						question={questions[questionId]}
						/> );
			}
		});
		return (
			<div className="ww-question-list">
				<h3>Question</h3>
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
});

export default QuestionList
