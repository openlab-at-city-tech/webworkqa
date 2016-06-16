import React from 'react';
import Question from './Question';

var QuestionList = React.createClass({
	render: function() {
		const { collapsed, handleToggleAccordion, handleToggleVote, questions, questionsById, scores, votes } = this.props

		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};
		var rows = []

		questionsById.forEach(function(questionId) {
			if ( questions.hasOwnProperty( questionId ) ) {
				let myVote = votes.hasOwnProperty( questionId ) ? votes[questionId] : '';
				let score = scores.hasOwnProperty( questionId ) ? scores[questionId] : 0;
				let isCollapsed = collapsed.hasOwnProperty( questionId );

				rows.push( <Question
						handleToggleAccordion={handleToggleAccordion}
						handleToggleVote={handleToggleVote}
						isCollapsed={isCollapsed}
						itemId={questionId}
						key={questionId}
						question={questions[questionId]}
						myVote={myVote}
						score={score}
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
