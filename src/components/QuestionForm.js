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

		return (
			<div className={divClassName}>
				<form
				  className={formClassName}
				  onSubmit={ e => {
					  onQuestionFormSubmit( e, content, tried, problemText )
				  } }
				>
					<h3>Ask a Question</h3>

					<a
					  href="#"
					  onClick={ e => {
						  e.preventDefault()
						  onAccordionClick()
					  } }
					  className="accordion-toggle"
					>
						{isCollapsed ? '\u25c1' : '\u25bd'}
					</a>

					<div className='question-block'>
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
						  disabled={isPending}
						  type="submit"
						  value={isPending ? 'Submitting...' : 'Submit!'}
						/>
					</div>
				</form>
			</div>
		);
	}
});

export default QuestionForm;
