import React from 'react'
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'

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

		// Non-breaking space.
		const pfcLabel = '\u00a0'

		return (
			<div className={divClassName}>
				<h3 className="ww-header">
					Respond to this question
				</h3>

				<div className="response-block">
					<form
					  className={formClassName}
					  onSubmit={ ( e ) => onResponseFormSubmit( e, responseText ) }
					>
						<PreviewableFieldContainer
						  fieldName={textareaName}
						  id={textareaName}
						  label={pfcLabel}
						  value={responseText}
						/>

						<input
						  className="button"
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
