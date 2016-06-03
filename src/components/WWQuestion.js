import React from 'react';
import WWScoreDialog from './WWScoreDialog';
import WWResponseList from './WWResponseList';
import connectToVoteGetter from './ConnectToVoteGetter'

var WWQuestion = React.createClass({
	render: function() {
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
				<WWScoreDialog
					score={this.props.score}
					myvote={this.props.myvote}
					onVoteChange={this.props.onVoteChange}
				/>

				<div className="ww-question-content" style={styles.wwQuestionContent}>
					{this.props.question.content}

					<WWResponseList responses={this.props.question.responses} />
				</div>
			</li>
		);
	}
});


// Make a vote getter.
WWQuestion = connectToVoteGetter( WWQuestion );

export default WWQuestion;
