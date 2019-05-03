import React, { Component } from 'react'
import { __ } from '@wordpress/i18n';

export default class EditSaveButton extends Component {
	render() {
		const { isPending, onClick } = this.props

		let buttonText = __( 'Save', 'webwork' )
		if ( isPending ) {
			buttonText = __( 'Saving...', 'webwork' )
		}

		return (
			<button
				className="button edit-save-button"
				onClick={onClick}
				type="submit"
			>
				{buttonText}
			</button>
		)
	}
}
