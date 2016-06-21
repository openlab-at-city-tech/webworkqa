import React from 'react';
import { If, Then } from 'react-if'
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'

var Response = React.createClass({
	render: function() {
		const { isMyQuestion, response, responseId } = this.props
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
				<div className="ww-response-content" style={styles.wwResponseContent}>
					{content}
				</div>

				<If condition={isMyQuestion}>
					<Then><AnsweredDialogContainer responseId={responseId} /></Then>
				</If>

				<ScoreDialogContainer itemId={responseId} />
			</li>
		);
	}
});

export default Response;
