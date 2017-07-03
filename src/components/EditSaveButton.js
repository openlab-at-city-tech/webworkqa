import React, { Component } from 'react'

export default class EditSaveButton extends Component {
	render() {
		const { isPending, onClick } = this.props

		let buttonText = 'Save'
		if ( isPending ) {
			buttonText = 'Saving...'
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
