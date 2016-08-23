import React from 'react'

const ResponseForm = React.createClass( {
	render: function() {
		const {
			isCollapsed, isPending, questionId, responseText,
			onAccordionClick, onResponseFormSubmit, onTextareaChange
		} = this.props

		const textareaName = 'response-text-' + questionId
		const submitName = 'response-submit-' + questionId

		let formClassName = 'response-form hide-when-closed'
		if ( isPending ) {
			formClassName += ' form-pending'
		}

		let accordionToggleClass = 'fa accordion-toggle'
		if ( isCollapsed ) {
			accordionToggleClass += ' fa-arrow-circle-o-down'
		} else {
			accordionToggleClass += ' fa-arrow-circle-up'
		}

		let divClassName = 'ww-question-response-form'
		if ( isCollapsed ) {
			divClassName += ' form-collapsed'
		}

		return (
			<div className={divClassName}>
				<a
				  className="ww-collapsible-section-link"
				  href="#"
				  onClick={ e => {
					  e.preventDefault()
					  onAccordionClick()
				  } }
				>
					<h3 className="ww-header ww-collapsible-section-header">
						Respond to this question
					</h3>
					<i
					  aria-hidden="true"
					  className={accordionToggleClass}
					></i>
				</a>

				<div className="response-block ww-collapsible-block">
					<form
					  className={formClassName}
					  onSubmit={ ( e ) => onResponseFormSubmit( e, responseText ) }
					>
						<textarea
						  className="response-text"
						  disabled={isPending}
						  id={textareaName}
						  name={textareaName}
						  onChange={onTextareaChange}
						  placeholder="Enter your response here"
						  value={responseText}
						/>

						<input
						  className="response-submit"
						  disabled={isPending}
						  id={submitName}
						  name={submitName}
						  type="submit"
						  value={isPending ? "Submitting..." : "Submit"}
						/>
					</form>
				</div>
			</div>
		)
	}
} )

export default ResponseForm
