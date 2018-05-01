import React, { Component } from 'react';

export default class Uploader extends Component {
	render() {
		const { onUploadClick } = this.props

		return (
			<button
					className="question-form-upload-button"
					onClick={function(e){
						e.preventDefault()
						onUploadClick()
					}}
				>Add Files <i className="fa fa-upload"></i>
			</button>
		)
	}
}
