import React, { Component } from 'react';
import { If, Then } from 'react-if'
import ScoreDialogContainer from '../containers/ScoreDialogContainer';
import ResponseList from './ResponseList';
import ResponseFormContainer from '../containers/ResponseFormContainer';

export default class Question extends Component {
	render() {
		const { answered, collapsed, onAccordionClick, itemId, question, responseIdMap, responses, userCanPostResponse } = this.props
		const { title, content, authorAvatar, authorName } = question

		const isCollapsed = collapsed.hasOwnProperty( itemId );
		const isMyQuestion = question.isMyQuestion > 0;

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
						<ResponseFormContainer questionId={itemId} />
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
}
