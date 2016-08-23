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

		let aeClass = 'fa accordion-toggle'
		if ( isCollapsed ) {
			aeClass += ' fa-arrow-circle-o-down'
		} else {
			aeClass += ' fa-arrow-circle-up'
		}

		const accordionElement = (
			<i
			  aria-hidden="true"
			  className={aeClass}
			></i>
		)

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

		let responseCountElements = []
		if ( ! isSingleProblem ) {
			responseCountElements.push( <span key="response-sep" className="ww-subtitle-sep">|</span> )
			responseCountElements.push(
				<span key="response-value" className="ww-subtitle-section">
					{responseCount}
				</span>
			)
		}

		const questionSubtitleElement = (
			<div className="ww-subtitle ww-question-subtitle">
				<span className="ww-subtitle-section">
					{timeAgo}
				</span>
				{responseCountElements}
			</div>
		)

		let questionCourseElement
		if ( ! isSingleProblem ) {
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

			questionCourseElement = (
				<div className="question-course-data">
					{courseDataString}
				</div>
			)
		}

		const questionScoreElement = (
			<ScoreDialogContainer
			  itemId={itemId}
			  itemType='question'
			/>
		)

		let respondLinkElement
		if ( isSingleProblem && userCanPostResponse ) {
			respondLinkElement = (
				<div className="respond-link">
					<a
					  href="#"
					  onClick={ e => {
						  e.preventDefault()
						  this.onGoToResponseFormClick( itemId )
					  } }
					>
						Respond
					</a>
				</div>
			)
		}


		const questionMetadataElement = (
			<div className="question-metadata">
				{questionCourseElement}
				{respondLinkElement}
				{questionScoreElement}
			</div>
		)

		let problemSummaryClass = 'ww-question-content-section ww-question-problem-summary hide-when-closed'
		if ( isProblemSummaryCollapsed ) {
			problemSummaryClass += ' problem-summary-collapsed'
		}

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

		let accordionToggleClass = 'fa accordion-toggle'
		if ( isProblemSummaryCollapsed ) {
			accordionToggleClass += ' fa-arrow-circle-o-down'
		} else {
			accordionToggleClass += ' fa-arrow-circle-up'
		}

		let triedElements
		if ( isSingleProblem ) {
			triedElements = (
				<span>
					<div className="ww-question-content-section-header">What I've tried:</div>
					<div className="ww-question-content-section ww-question-content-text">
						{formattedTried}
					</div>
				</span>
			)
		}

		const contentElements = (
			<div key="contentElements" className="hide-when-closed">
				<div className="ww-question-content-section-header">My question:</div>
				<div className="ww-question-content-section ww-question-content-text">{formattedContent}</div>
				{triedElements}

			</div>
		)

		const problemElement = (
			<div
			  className={problemSummaryClass}
			  key="problemElement"
			  onClick={onProblemSummaryClick}
			>
				<div
				  className="ww-my-problem"
				>
					<span
					  className="ww-my-problem-text"
					>
						View My Problem
					</span>
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
		)

		let orderedElements = [ problemElement, contentElements ]

		const questionSummaryElement = (
			<div className="ww-question-content-wrapper">
				<div className="ww-question-content">
					{questionTitleElement}
					{questionSubtitleElement}

					{orderedElements}
				</div>

				<div className="hide-when-closed">
					{questionMetadataElement}
				</div>
			</div>
		)

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
							{accordionElement}
							<span className="ww-question-header-text">
								{hasAnswer ? 'Answered!' : 'Unanswered'}
							</span>
						</a>

					</div>

					<div className="ww-author-avatar">
						<img src={authorAvatar} />
					</div>

					<div>
						{questionSummaryElement}
					</div>
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
