import React, { Component } from 'react';
import FormattedProblem from './FormattedProblem'

export default class PreviewableField extends Component {
	componentDidUpdate() {
		if ( window.hasOwnProperty( 'MathJax' ) && window.MathJax.hasOwnProperty( 'Hub' ) ) {
			const cssId = this.props.id + '-preview'
			window.MathJax.Hub.Queue(["Update", window.MathJax.Hub, cssId]);
		}
	}

	render() {
		const {
			id, fieldName, label, value, isPending, isPreviewVisible,
			onPreviewToggleClick, onTextareaChange
		} = this.props

		let contentSectionClass = 'ww-question-form-section'
		if ( isPreviewVisible ) {
			contentSectionClass += ' preview-visible'
		}

		const previewId = id + '-preview'

		const delimRegExp = /\\begin\{((?:display)?math)\}([^]*?)\\end\{\1\}/gm
		let display, openDelim, closeDelim, newVal
		const previewContent = value.replace( delimRegExp, function( a, type, math ) {

			if ( 'displaymath' == type ) {
				display = 'block'
				openDelim = '{{{LATEX_DELIM_DISPLAY_OPEN}}}'
				closeDelim = '{{{LATEX_DELIM_DISPLAY_CLOSE}}}'
			} else {
				display = 'inline'
				openDelim = '{{{LATEX_DELIM_INLINE_OPEN}}}'
				closeDelim = '{{{LATEX_DELIM_INLINE_CLOSE}}}'
			}

			return openDelim + math + closeDelim
		} )

		return (
			<div className={contentSectionClass}>
				<label htmlFor={id}>{label}</label>

				<button
				  className="preview-toggle"
				  onClick={e => {
				    onPreviewToggleClick()
				  }}
				  type="button"
				>
				  {isPreviewVisible ? 'Edit' : 'Preview'}
				</button>

				<textarea
				  id={id}
				  name={id}
				  value={value}
				  disabled={isPending}
				  onChange={ e => {
					onTextareaChange( e.target.value )
				  } }
				/>

				<div
				  className="ww-preview"
				  id={previewId}
				>
					<FormattedProblem
					  itemId={id}
					  isVisible={isPreviewVisible}
					  content={previewContent}
					/>
				</div>
			</div>
		)
	}
}
