import React from 'react';
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'

var moment = require( 'moment' )

var Response = React.createClass({
	render: function() {
		const { isMyQuestion, response, responseId } = this.props
		const { content, authorAvatar, authorName, authorUserType, isAnswer } = response

		const userIsAdmin = window.WWData.user_is_admin

		const answeredElement = ( isMyQuestion || userIsAdmin ) ? <AnsweredDialogContainer responseId={responseId} /> : ''

		const timeAgo = moment( response.postDate ).fromNow()

		return (
			<li className={isAnswer ? 'ww-response is-answer' : 'ww-response'}>
				<div className="ww-author-avatar">
					<img src={authorAvatar} />
					<div className="response-user-type">{authorUserType}</div>
				</div>

				<div className="ww-response-content">
					<div className="ww-author-name">{authorName}</div>
					<div className="ww-subtitle ww-response-subtitle">
						<span className="ww-subtitle-section">
							{timeAgo}
						</span>
					</div>

					{content}
					{answeredElement}
				</div>

				<ScoreDialogContainer
				  itemId={responseId}
				  itemType='response'
				/>
			</li>
		);
	}
});

export default Response;
