import React, { Component } from 'react'
import Scroll, { Element } from 'react-scroll'

import ScoreDialogContainer from '../containers/ScoreDialogContainer'
import ResponseList from './ResponseList'
import ResponseFormContainer from '../containers/ResponseFormContainer'
import FormattedProblem from './FormattedProblem'

var moment = require( 'moment' )

export default class Question extends Component {
	componentDidMount() {
		const {
			isCurrentQuestion, isSingleProblem,
			itemId, initialLoadComplete, userCanPostResponse
		} = this.props

		if ( ! isSingleProblem ) {
			return
		}

		if ( initialLoadComplete && userCanPostResponse ) {
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
		const Element = Scroll.Element

		const anchorName = 'question-' + itemId

		const questionTitleElement = (
			<a
			  className="ww-question-link"
			  href={questionLink}
			>
				<div className="ww-author-name">A Question from {authorName}</div>
			</a>
		)

		const timeAgo = moment( question.postDate).fromNow()

		let responseCount
		if ( 1 == question.responseCount ) {
			responseCount = '1 Response'
		} else {
			responseCount = question.responseCount + ' Responses'
		}

		const questionSubtitleElement = (
			<div className="ww-question-subtitle">
				<span className="ww-question-subtitle-section">
					{timeAgo}
				</span>
				<span className="ww-question-subtitle-sep">|</span>
				<span className="ww-question-subtitle-section">
					{responseCount}
				</span>
			</div>
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
						{questionSubtitleElement}
						<div className="ww-question-content-section-header">My question:</div>
						<div className="ww-question-content-section">{formattedContent}</div>

						<div className="ww-question-content-section-header">What I've tried:</div>
						<div className="ww-question-content-section">
							{formattedTried}
						</div>

					</div>

					<div
					  className={problemSummaryClass}
					  onClick={onProblemSummaryClick}
					>
						<div
						  className="ww-my-problem"
						>
							My Problem
						</div>

						<div
						  className="ww-my-problem-content"
						>
							<FormattedProblem
							  itemId={questionId}
							  content={problemText}
							/>
						</div>
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
								{hasAnswer ? 'Answered!' : 'Unanswered'}
							</span>
						</a>

					</div>

					{respondLinkElement}

					<div className="ww-author-avatar hide-when-closed">
						<img src={authorAvatar} />
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
