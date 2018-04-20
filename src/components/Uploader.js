import React, { Component } from 'react';

export default class Uploader extends Component {
	render() {
		const { onUploadClick } = this.props

		return (
			<div>
				<a
					className="question-form-upload-button"
					href="#"
					id="insert-media-button"
					onClick={function(e){
						e.preventDefault()
						onUploadClick()
					}}
					value="Upload"
				><i className="fa fa-upload"></i><span className="screen-reader-text">Upload</span></a>
			</div>
		)
	}
}
