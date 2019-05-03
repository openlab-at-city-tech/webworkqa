import React, { Component } from 'react'
import { getString } from '../util/webwork-i18n'

export default class EditSaveButton extends Component {
	render() {
		const { isPending, onClick } = this.props

		let buttonText = getString('saveButtonText')
		if ( isPending ) {
			buttonText = getString('saveButtonTextInProgress')
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
