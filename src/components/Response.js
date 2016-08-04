import React from 'react';
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'

var Response = React.createClass({
	render: function() {
		const { isMyQuestion, response, responseId } = this.props
		const { content, authorAvatar, authorName, authorUserType, isAnswer } = response

		const userIsAdmin = window.WWData.user_is_admin

		const answeredElement = ( isMyQuestion || userIsAdmin ) ? <AnsweredDialogContainer responseId={responseId} /> : ''

		return (
			<li>
				<div className={isAnswer ? 'ww-response is-answer' : 'ww-response'}>
					<div className="response-user-type">{authorUserType}</div>

					<div className="ww-author-avatar">
						<img src={authorAvatar} />
					</div>

					<div className="ww-response-content">
						<div className="ww-author-name">{authorName}</div>
						{content}
						{answeredElement}
					</div>

					<ScoreDialogContainer
					  itemId={responseId}
					  itemType='response'
					/>
				</div>
			</li>
		);
	}
});

export default Response;
