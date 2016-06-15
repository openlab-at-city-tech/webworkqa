import React from 'react';
import ScoreDialog from './ScoreDialog';
import connectToVoteGetter from './ConnectToVoteGetter'

var Response = React.createClass({
	render: function() {
		var styles = {
			li: {
				overflow: 'hidden',
				marginBottom: '15px'
			},
			wwResponseContent: {
				paddingLeft: '50px'
			}
		};
		return (
			<li style={styles.li}>
				<ScoreDialog
					score={this.props.score}
					myvote={this.props.myvote}
					onVoteChange={this.props.onVoteChange}
				/>
				<div className="ww-response-content" style={styles.wwResponseContent}>
					{this.props.response.content}
				</div>
			</li>
		);
	}
});

export default Response;
