import React, { Component } from 'react';
import Scroll from 'react-scroll'
import EditSaveButtonContainer from '../containers/EditSaveButtonContainer'
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'
import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import AnsweredDialogContainer from '../containers/AnsweredDialogContainer'
import FormattedProblem from './FormattedProblem'

var moment = require( 'moment' )

export default class Response extends Component {
	render() {
		const {
			isEditing, isMyQuestion,
			questionId, response, responseId,
			userCanEdit, userCanPostResponse,
			onEditClick
		} = this.props

		if ( ! response ) {
			return null
		}

		const { content, authorAvatar, authorName, authorUserType, isAnswer } = response
		const userIsAdmin = window.WWData.user_is_admin

		const answeredElement = ( isMyQuestion || userIsAdmin ) ? <AnsweredDialogContainer responseId={responseId} /> : ''

		const timestamp = moment( response.postDate ).format( 'MMMM D, YYYY' )

		const editLinkOnclick = function( e ) {
			e.preventDefault()
			onEditClick()
		}

		let editLinkElements = []
		if ( userCanEdit ) {
			editLinkElements.push(
				<span key="editing-sep" className="ww-subtitle-sep">|</span>
			)

			if ( isEditing ) {
				editLinkElements.push(
					<a
						href="#"
						onClick={editLinkOnclick}
						key="edit-link-editing"
						className="ww-edit-link ww-edit-link-editing"
					>Editing</a>
				)
			} else {
				editLinkElements.push(
					<a
						href="#"
						onClick={editLinkOnclick}
						key="edit-link-edit"
						className="ww-edit-link ww-edit-link-edit"
					>Edit</a>
				)
			}
		}

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

		let contentElements = []
		if ( isEditing ) {
			contentElements.push(
				<div key="content" className="editable-field">
					<PreviewableFieldContainer
						fieldId={'response-' + responseId}
						fieldName='content'
						key='content'
						label=''
					/>
				</div>
			)

			contentElements.push(
				<EditSaveButtonContainer
					fieldId={responseId}
					fieldType='response'
					key="button"
				/>
			)
		} else {
			contentElements.push(
				<FormattedProblem
				  itemId={contentId}
				  content={content}
				  key='content'
				/>
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
							Posted {timestamp}
						</span>
						{editLinkElements}
					</div>

					{contentElements}

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
