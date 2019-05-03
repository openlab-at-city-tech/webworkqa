import React, { Component } from 'react'
import PreviewableFieldContainer from '../containers/PreviewableFieldContainer'
import { __ } from '@wordpress/i18n';

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
		const pfcLabel = __( 'Response text', 'webwork' )

		return (
			<div className={divClassName}>
				<h3 className="ww-header">
					{ __( 'Respond to this question', 'webwork' ) }
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
						  value={isPending ? __( 'Submitting...', 'webwork' ) : __( 'Submit', 'webwork' ) }
						/>
					</form>
				</div>
			</div>
		)
	}
}
