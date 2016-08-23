import React from 'react';

var QuestionForm = React.createClass({
	render: function() {
		const {
			content, isCollapsed, isPending, problemId, problemText, tried,
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
						<p className="ww-question-gloss">
							Please review the questions below to see if your question has already been answered.
						</p>


						<input type="hidden" name="ww-problem-id" value={problemId} />
						<label for="ww-question-content">What is your question?</label>
						<textarea
						  id="ww-question-content"
						  name="ww-question-content"
						  value={content}
						  disabled={isPending}
						  onChange={ e => {
							onTextareaChange( 'content', e.target.value )
						  } }
						/>

						<label for="ww-question-tried">Describe what you have tried?</label>
						<textarea
						  id="ww-question-tried"
						  name="ww-question-tried"
						  value={tried}
						  disabled={isPending}
						  onChange={ e => {
							onTextareaChange( 'tried', e.target.value )
						  } }
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
