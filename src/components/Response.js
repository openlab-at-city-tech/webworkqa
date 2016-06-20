import React from 'react';
import ScoreDialogContainer from '../containers/ScoreDialogContainer';

var Response = React.createClass({
	render: function() {
		const { response, responseId } = this.props
		const { content } = response

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
				<ScoreDialogContainer itemId={responseId} />
				<div className="ww-response-content" style={styles.wwResponseContent}>
					{content}
				</div>
			</li>
		);
	}
});

export default Response;
