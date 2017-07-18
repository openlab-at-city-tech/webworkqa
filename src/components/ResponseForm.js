import React, { Component } from 'react'
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'

export default class ResponseForm extends Component {
	render() {
		const {
			isCollapsed, isPending, questionId, responseText,
			onAccordionClick, onResponseFormSubmit
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
						  fieldId={'response-' + questionId}
						  fieldName='content'
						  id={textareaName}
						  label={pfcLabel}
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
}
