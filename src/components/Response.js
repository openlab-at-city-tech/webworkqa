import React, { Component } from 'react';
import Scroll from 'react-scroll'
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'
import FormattedProblem from './FormattedProblem'

var moment = require( 'moment' )

export default class Response extends Component {
	render() {
		const { isMyQuestion, questionId, response, responseId, userCanPostResponse } = this.props
		if ( ! response ) {
			return null
		}

		const { content, authorAvatar, authorName, authorUserType, isAnswer } = response
		const userIsAdmin = window.WWData.user_is_admin

		const answeredElement = ( isMyQuestion || userIsAdmin ) ? <AnsweredDialogContainer responseId={responseId} /> : ''

		const timeAgo = moment( response.postDate ).fromNow()

		let respondLinkElement
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
						Reply
					</a>
				</div>
			)
		}

		const contentId = 'response-' + responseId

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

					<FormattedProblem
					  itemId={contentId}
					  content={content}
					/>

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
	}

	/**
	 * Scrolling callback for clicking the "Respond" link.
	 *
	 * Not currently aware of state, but maybe it should be - ie to expand the Response form
	 * or flash the form after scroll. At that point, callback should be moved to the
	 * container with associated action/reducer.
	 */
	onGoToResponseFormClick( itemId ) {
		Scroll.scroller.scrollTo( 'response-form-' + itemId, {
			duration: 1000,
			offset: -80, // for toolbar
			smooth: true
		} )
	}
}
