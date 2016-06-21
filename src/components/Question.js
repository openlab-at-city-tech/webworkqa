import React, { Component } from 'react';
import ScoreDialogContainer from '../containers/ScoreDialogContainer';
import ResponseList from './ResponseList';

export default class Question extends Component {
	render() {
		const { answered, collapsed, onAccordionClick, itemId, question, responseIdMap, responses } = this.props
		const { title, content, authorAvatar, authorName } = question

		const isCollapsed = collapsed.hasOwnProperty( itemId );
		const isMyQuestion = question.isMyQuestion > 0;

		// Get isAnswered dynamically from the 'answered' state.
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

					<div className="ww-author-avatar">
						<img src={authorAvatar} />
						<div className="ww-author-name">
							{authorName}
						</div>
					</div>

					<div
					  className="ww-question-content"
					  style={styles.wwQuestionContent}
					>
						{content}
					</div>

					<ScoreDialogContainer itemId={itemId} />
				</div>

				<ResponseList
				  responseIds={responseIdMap[itemId]}
				  responses={responses}
				  isMyQuestion={isMyQuestion}
				/>

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
