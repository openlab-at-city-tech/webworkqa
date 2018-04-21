import React, { Component } from 'react';
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'
import UploaderContainer from '../containers/UploaderContainer'

export default class QuestionForm extends Component {
	render() {
		const {
			content, isCollapsed, isPending,
			problemId, problemText, problemHasQuestions, tried,
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

		return (
			<div className={divClassName}>
				<form
				  className={formClassName}
				  onSubmit={ e => {
					  onQuestionFormSubmit( e, content, tried, problemText )
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
						/>

						<PreviewableFieldContainer
						  fieldId='question-form'
						  fieldName="tried"
						  id="ww-question-form-tried"
						  label="Describe what you have tried."
						/>

						<input
						  className="button"
						  disabled={isPending}
						  type="submit"
						  value={isPending ? 'Submitting...' : 'Submit'}
						/>

						<UploaderContainer
							formId='question-form'
							itemId="0"
							itemType='question'
						/>
					</div>
				</form>
			</div>
		);
	}
}
