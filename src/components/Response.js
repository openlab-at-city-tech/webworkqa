import React from 'react';
import { If, Then } from 'react-if'
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'

var Response = React.createClass({
	render: function() {
		const { isMyQuestion, response, responseId } = this.props
		const { content, authorAvatar, authorName, authorUserType, isAnswer } = response

		return (
			<li>
				<div className={isAnswer ? 'ww-response is-answer' : 'ww-response'}>

					<div className="ww-author-avatar">
						<img src={authorAvatar} />
						<div className="response-user-type">{authorUserType}</div>
					</div>

					<div className="ww-response-content">
						<div className="ww-author-name">{authorName}</div>
						{content}

						<If condition={isMyQuestion}>
							<Then><AnsweredDialogContainer responseId={responseId} /></Then>
						</If>
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
