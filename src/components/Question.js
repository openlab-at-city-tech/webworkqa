import React, { Component } from 'react';
import { If, Then, Else } from 'react-if'
import Scroll from 'react-scroll'

import ScoreDialogContainer from '../containers/ScoreDialogContainer';
import ResponseList from './ResponseList';
import ResponseFormContainer from '../containers/ResponseFormContainer';

export default class Question extends Component {
	componentDidMount() {
		const { itemId, initialLoadComplete } = this.props

		if ( initialLoadComplete ) {
			const responseScrollElementName = 'response-form-' + itemId
			Scroll.scroller.scrollTo( responseScrollElementName, {
				duration: 1000,
				offset: -80, // for toolbar
				smooth: true
			} )
		}
	}

	render() {
		const {
			isAnswered, isCollapsed, itemId, question, responseIds, responses,
			onAccordionClick,
			userCanPostResponse
		} = this.props

		const { title, content, authorAvatar, authorName } = question

		const isMyQuestion = question.isMyQuestion > 0;

		const responseScrollElementName = 'response-form-' + itemId
		var Element = Scroll.Element

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

					<If condition={isCollapsed}>
						<Then>
							<div className="ww-author-name">{authorName}</div>
						</Then>
						<Else>
							<div>
								<div
								  className="ww-question-content hide-when-closed"
								  style={styles.wwQuestionContent}
								>
									<div className="ww-author-name">{authorName}</div>
									{content}

								</div>

								<ScoreDialogContainer itemId={itemId} />
							</div>
						</Else>
					</If>
				</div>

				<div className={isCollapsed ? 'accordion-content accordion-closed' : 'accordion-content accordion-open'}>
					<ResponseList
					  isMyQuestion={isMyQuestion}
					  questionId={itemId}
					  responseIds={responseIds}
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
				</div>
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
