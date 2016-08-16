import React, { Component } from 'react'
import Scroll from 'react-scroll'

import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import ResponseList from './ResponseList'
import ResponseFormContainer from '../containers/ResponseFormContainer'
import FormattedProblem from './FormattedProblem'

var moment = require( 'moment' )

export default class Question extends Component {
	componentDidMount() {
		const { isCurrentQuestion, itemId, initialLoadComplete } = this.props

		if ( initialLoadComplete ) {
			const responseScrollElementName = 'response-form-' + itemId
			Scroll.scroller.scrollTo( responseScrollElementName, {
				duration: 1000,
				offset: -80, // for toolbar
				smooth: true
			} )
		}

		if ( isCurrentQuestion ) {
			// Delay to allow LaTeX to render
			setTimeout( function() {
				Scroll.scroller.scrollTo( 'question-' + itemId, {
					duration: 1500,
					smooth: true
				} )
			}, 500 )
		}
	}

	render() {
		const {
			isCollapsed, isProblemSummaryCollapsed, isSingleProblem,
			itemId, question, questionLink, responseIds, responses,
			userCanPostResponse,
			onAccordionClick, onProblemSummaryClick
		} = this.props

		const {
			tried, content, questionId, authorAvatar, authorName,
			problemText, hasAnswer
		} = question

		const isMyQuestion = question.isMyQuestion > 0

		let hasProblemText = false
		if ( problemText && problemText.length > 0 ) {
			hasProblemText = true
		}

		const responseScrollElementName = 'response-form-' + itemId
		var Element = Scroll.Element

		const anchorName = 'question-' + itemId

		const questionTitleElement = (
			<a href={questionLink}>
				<div className="ww-author-name">A Question from {authorName}</div>
			</a>
		)

		let respondLinkElement
		if ( isSingleProblem && userCanPostResponse && ! isCollapsed ) {
			respondLinkElement = (
				<a
				  href="#"
				  className="respond-link"
				  onClick={ e => {
					  this.onGoToResponseFormClick( itemId )
				  } }
				>
					Respond
				</a>
			)
		}

		let questionMetadataElement
		if ( isSingleProblem ) {
			questionMetadataElement = (
				<ScoreDialogContainer
				  itemId={itemId}
				  itemType='question'
				/>
			)
		} else {
			let courseData = []
			if ( question.problemSet ) {
				courseData.push( question.problemSet );
			}

			if ( question.course ) {
				courseData.push( question.course );
			}

			if ( question.section ) {
				courseData.push( question.section );
			}

			const courseDataString = courseData.join( ' | ' )

			const questionCourseElement = (
				<div className="question-course-data">
					{courseDataString}
				</div>
			)

			const questionStatsElement = (
				<div className="item-stats question-stats">
					<div>{question.voteCount} likes</div>
					<div>{question.responseCount} responses</div>
				</div>
			)

			questionMetadataElement = (
				<div>
					{questionCourseElement}
					{questionStatsElement}
				</div>
			)
		}

		let problemSummaryClass = 'ww-question-content-section ww-question-problem-summary'
		if ( isProblemSummaryCollapsed ) {
			problemSummaryClass += ' problem-summary-collapsed'
		}

		let questionSummaryElement
		if ( isCollapsed ) {
			questionSummaryElement = questionTitleElement
		} else {
			const contentId = 'content-' + itemId
			const formattedContent =
				<FormattedProblem
				  itemId={contentId}
				  content={content}
				/>

			const triedId = 'tried-' + itemId
			const formattedTried = (
				<FormattedProblem
				  itemId={triedId}
				  content={tried}
				/>
			)

			questionSummaryElement = (
				<div className="ww-question-content-wrapper">
					<div className="ww-question-content">
						{questionTitleElement}
						<em>My question:</em>
						<div className="ww-question-content-section">{formattedContent}</div>

						<em>What I've tried:</em>
						<div className="ww-question-content-section">
							{formattedTried}
						</div>

					</div>

					<div
					  className={problemSummaryClass}
					  onClick={onProblemSummaryClick}
					>
						<em>My problem:</em>
						<FormattedProblem
						  itemId={questionId}
						  content={problemText}
						/>
					</div>

					{questionMetadataElement}
				</div>
			)
		}

		let responseFormElement
		if ( userCanPostResponse ) {
			responseFormElement = (
				<Element name={responseScrollElementName}>
					<ResponseFormContainer
					  questionId={itemId}
					/>
				</Element>
			)
		}

		let responsesElement
		if ( isSingleProblem ) {
			responsesElement = (
				<div className={isCollapsed ? 'accordion-content accordion-closed' : 'accordion-content accordion-open'}>
					<ResponseList
					  isMyQuestion={isMyQuestion}
					  questionId={itemId}
					  responseIds={responseIds}
					  responses={responses}
					/>

					{responseFormElement}
				</div>
			)
		}

		const timeAgo = moment( question.postDate).fromNow()

		return (
			<li
			  className={this.getClassName( isCollapsed, isMyQuestion, hasAnswer )}
			>
				<Element name={anchorName}>
					<a name={anchorName}></a>
				</Element>

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
								{hasAnswer ? 'Answered' : 'Unanswered'}
							</span>

							<span className="ww-question-header-toggle-label">
								{isCollapsed ? 'Expand' : ''}
							</span>

							{isCollapsed ? '\u25c1' : '\u25bd'}
						</a>

					</div>

					{respondLinkElement}

					<div className="ww-author-avatar hide-when-closed">
						<img src={authorAvatar} />
						<div className="time-ago">
							{timeAgo}
						</div>
					</div>

					{questionSummaryElement}
				</div>

				{responsesElement}
			</li>
		);
	}

	/**
	 * Get a class name for the <li> element.
	 */
	getClassName( isCollapsed, isMyQuestion, hasAnswer ) {
		let classes = []

		if ( isCollapsed ) {
			classes.push( 'question-closed' )
		} else {
			classes.push( 'question-open' )
		}

		if ( isMyQuestion ) {
			classes.push( 'my-question' )
		}

		if ( hasAnswer ) {
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
