import React from 'react'

const ResponseForm = React.createClass( {
	render: function() {
		const { isPending, onResponseFormSubmit, onTextareaChange, questionId, responseText } = this.props
		const textareaName = 'response-text-' + questionId
		const submitName = 'response-submit-' + questionId

		let formClassName = 'response-form hide-when-closed'
		if ( isPending ) {
			formClassName += ' form-pending'
		}

		return (
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
		)
	}
} )

export default ResponseForm
