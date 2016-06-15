import React from 'react';
import ScoreDialog from './ScoreDialog';
import ResponseList from './ResponseList';
import connectToVoteGetter from './ConnectToVoteGetter'

var Question = React.createClass({
	render: function() {
		const { handleToggleVote, itemId, myVote, score } = this.props
		const { title, content } = this.props.question
		const responses = []

		var styles = {
			li: {
				overflow: 'hidden',
				marginBottom: '15px'
			},
			wwQuestionContent: {
				paddingLeft: '50px'
			}
		};

		return (
			<li style={styles.li}>
				<ScoreDialog
					score={score}
					myVote={myVote}
					itemId={itemId}
					handleToggleVote={handleToggleVote}
				/>

				<div className="ww-question-content" style={styles.wwQuestionContent}>
					{content}

					<ResponseList responses={responses} />
				</div>
			</li>
		);
	}
});

export default Question
