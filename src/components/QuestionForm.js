import React, { Component } from 'react';
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'

export default class QuestionForm extends Component {
	render() {
		const {
			content, isCollapsed, isPending,
			problemId, problemText, problemHasQuestions, tried, triedIsEmpty,
			onAccordionClick, onTextareaChange, onQuestionFormSubmit
		} = this.props

		let formClassName = 'question-form'
		if ( isPending ) {
			formClassName += ' form-pending'
		}

		let divClassName = 'ww-ask-question-form'
		if ( isCollapsed ) {
			divClassName += ' form-collapsed'
		}

		let accordionToggleClass = 'fa accordion-toggle'
		if ( isCollapsed ) {
			accordionToggleClass += ' fa-arrow-circle-o-down'
		} else {
			accordionToggleClass += ' fa-arrow-circle-up'
		}

		let questionGloss = ''
		if ( problemHasQuestions ) {
			questionGloss = (
				<p className="ww-question-gloss">
					Please review the questions below to see if your question has already been answered.
				</p>
			)
		}

		const isPreviewContent = true
		let contentSectionClass = 'ww-question-form-section'
		if ( isPreviewContent ) {
			contentSectionClass += ' preview'
		}

		let triedIsEmptyNotice
		if ( triedIsEmpty ) {
			triedIsEmptyNotice = (
				<div
				  className="tried-is-empty"
				>You haven't described what you've tried. Did you know you can upload an image of your work?</div>
			)
		}

		let buttonClassName = 'button'
		if ( triedIsEmpty ) {
			buttonClassName += ' button-error'
		}

		return (
			<div className={divClassName}>
				<form
				  className={formClassName}
				  onSubmit={ e => {
					  onQuestionFormSubmit( e, content, tried, problemText, triedIsEmpty )
				  } }
				>
					<a
					  className="ww-collapsible-section-link"
					  href="#"
					  onClick={ e => {
						  e.preventDefault()
						  onAccordionClick()
					  } }
					>
						<h3 className="ww-header ww-collapsible-section-header">Ask a Question</h3>

						<i
						  aria-hidden="true"
						  className={accordionToggleClass}
						></i>
					</a>

					<div className="ww-collapsible-block">
						{questionGloss}

						<input type="hidden" name="ww-problem-id" value={problemId} />

						<PreviewableFieldContainer
						  fieldId='question-form'
						  fieldName="content"
						  id="ww-question-form-content"
						  label="What is your question?"
							labelIsVisible={true}
						/>

						<PreviewableFieldContainer
						  fieldId='question-form'
						  fieldName="tried"
						  id="ww-question-form-tried"
						  label="Describe what you have tried."
							labelIsVisible={true}
						/>

						{triedIsEmptyNotice}

						<input
						  className={buttonClassName}
						  disabled={isPending}
						  type="submit"
						  value={isPending ? 'Submitting...' : 'Submit'}
						/>
					</div>
				</form>
			</div>
		);
	}
}
