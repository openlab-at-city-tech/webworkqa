import React from 'react';
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'

var QuestionForm = React.createClass({
	render: function() {
		const {
			content, isCollapsed, isPending,
			problemId, problemText, problemHasQuestions, tried,
			onAccordionClick, onTextareaChange, onQuestionFormSubmit,
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
						  fieldName="content"
						  id="ww-question-content"
						  label="What is your question?"
						  value={content}
						/>

						<PreviewableFieldContainer
						  fieldName="tried"
						  id="ww-question-tried"
						  label="Describe what you have tried."
						  value={tried}
						/>

						<input
						  className="button"
						  disabled={isPending}
						  type="submit"
						  value={isPending ? 'Submitting...' : 'Submit'}
						/>
					</div>
				</form>
			</div>
		);
	}
});

export default QuestionForm;
