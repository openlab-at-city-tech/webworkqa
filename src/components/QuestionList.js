import React from 'react';
import Question from './Question';

var QuestionList = React.createClass({
	render: function() {
		const { questions, questionsById, handleToggleVote, scores, votes } = this.props

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

				rows.push( <Question
						key={questionId}
						itemId={questionId}
						question={questions[questionId]}
						handleToggleVote={handleToggleVote}
						myVote={myVote}
						score={score}
						/> );
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

export default QuestionList
