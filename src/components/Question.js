import React, { Component } from 'react';
import { If, Then } from 'react-if'
import Scroll from 'react-scroll'

import ScoreDialogContainer from '../containers/ScoreDialogContainer';
import ResponseList from './ResponseList';
import ResponseFormContainer from '../containers/ResponseFormContainer';

export default class Question extends Component {
	render() {
		const {
			answered, collapsed, itemId, question, responseIdMap, responses,
			onAccordionClick,
			userCanPostResponse
		} = this.props

		const { title, content, authorAvatar, authorName } = question

		const isCollapsed = collapsed.hasOwnProperty( itemId );
		const isMyQuestion = question.isMyQuestion > 0;

		const responseScrollElementName = 'response-form-' + itemId
		var Element = Scroll.Element

		// Get isAnswered dynamically from the 'answered' state.
		// Move this to mapStateToProps using ownProps
		let isAnswered = false
		if ( responseIdMap.hasOwnProperty( itemId ) ) {
			for ( var i = 0; i <= responseIdMap[ itemId ].length; i++ ) {
				if ( answered.hasOwnProperty( responseIdMap[ itemId ][ i ] ) ) {
					isAnswered = true
					break
				}
			}
		}

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
			<li
			  style={styles.li}
			  className={this.getClassName( isCollapsed, isMyQuestion, isAnswered )}
			>
				<div className="ww-question">
					<div className="ww-question-header">
						<a
						  href="#"
						  onClick={ e => {
							  e.preventDefault()
							  onAccordionClick( itemId )
						  } }
						>
							<span className="ww-question-header-text">
								{isAnswered ? 'Answered' : 'Unanswered'}
							</span>

							<span className="ww-question-header-toggle-label">
								{isCollapsed ? 'Expand' : ''}
							</span>

							{isCollapsed ? '\u25c1' : '\u25bd'}
						</a>

					</div>

					<h3>{authorName}</h3>

					<If condition={userCanPostResponse && ! isCollapsed}>
						<Then>
							<a
							  href="#"
							  className="respond-link"
							  onClick={ e => {
								  this.onGoToResponseFormClick( itemId )
							  } }
							>
								Respond
							</a>
						</Then>
					</If>

					<div className="ww-author-avatar hide-when-closed">
						<img src={authorAvatar} />
					</div>

					<div
					  className="ww-question-content hide-when-closed"
					  style={styles.wwQuestionContent}
					>
						{content}
					</div>

					<ScoreDialogContainer itemId={itemId} />
				</div>

				<ResponseList
				  isMyQuestion={isMyQuestion}
				  questionId={itemId}
				  responseIds={responseIdMap[itemId]}
				  responses={responses}
				/>

				<If condition={userCanPostResponse}>
					<Then>
						<Element name={responseScrollElementName}>
							<ResponseFormContainer
							  questionId={itemId}
							/>
						</Element>
					</Then>
				</If>
			</li>
		);
	}

	/**
	 * Get a class name for the <li> element.
	 */
	getClassName( isCollapsed, isMyQuestion, isAnswered ) {
		let classes = []

		if ( isCollapsed ) {
			classes.push( 'question-closed' )
		} else {
			classes.push( 'question-open' )
		}

		if ( isMyQuestion ) {
			classes.push( 'my-question' )
		}

		if ( isAnswered ) {
			classes.push( 'question-answered' )
		} else {
			classes.push( 'question-unanswered' )
		}

		return classes.join( ' ' )
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
