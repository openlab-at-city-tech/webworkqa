import React from 'react';
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'
import Scroll from 'react-scroll'

var moment = require( 'moment' )

var Response = React.createClass({
	render: function() {
		const { isMyQuestion, questionId, response, responseId } = this.props
		if ( ! response ) {
			return null
		}

		const { content, authorAvatar, authorName, authorUserType, isAnswer } = response
		const userIsAdmin = window.WWData.user_is_admin

		const answeredElement = ( isMyQuestion || userIsAdmin ) ? <AnsweredDialogContainer responseId={responseId} /> : ''

		const timeAgo = moment( response.postDate ).fromNow()

		let respondLinkElement
		const userCanPostResponse = true
		if ( userCanPostResponse ) {
			respondLinkElement = (
				<div className="respond-link">
					<a
					  href="#"
					  onClick={ e => {
						  e.preventDefault()
						  this.onGoToResponseFormClick( response.questionId )
					  } }
					>
						Respond
					</a>
				</div>
			)
		}

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

				<div className="item-metadata">
					{respondLinkElement}
					<ScoreDialogContainer
					  itemId={responseId}
					  itemType='response'
					/>
				</div>
			</li>
		);
	},

	/**
	 * Scrolling callback for clicking the "Respond" link.
	 *
	 * Not currently aware of state, but maybe it should be - ie to expand the Response form
	 * or flash the form after scroll. At that point, callback should be moved to the
	 * container with associated action/reducer.
	 */
	onGoToResponseFormClick: function( itemId ) {
		Scroll.scroller.scrollTo( 'response-form-' + itemId, {
			duration: 1000,
			offset: -80, // for toolbar
			smooth: true
		} )
	}
});

export default Response;
