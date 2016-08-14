import React, { Component } from 'react';
import { Link } from 'react-router'
import LaTeX from './LaTeX'

export default class FormattedProblem extends Component {
	render() {
		const { itemId, content } = this.props

		if ( ! content ) {
			return ( <span></span> )
		}

		const texRegExp = /(\{\{\{LATEX_DELIM_((?:DISPLAY)|(?:INLINE))_OPEN\}\}\})([^]*)(\{\{\{LATEX_DELIM_\2_CLOSE\}\}\})/gm
		const parts = content.split( texRegExp )
		let children = []
		let texIndex, texId, typeIndex, mathIndex, closeIndex, display;
		for ( var i = 0; i < parts.length; i++ ) {
			if ( i == typeIndex || i == mathIndex || i == closeIndex ) {
				continue
			}

			typeIndex = mathIndex = closeIndex = display = null;
			if ( parts[i] == '{{{LATEX_DELIM_DISPLAY_OPEN}}}' || parts[i] === '{{{LATEX_DELIM_INLINE_OPEN}}}' ) {
				texIndex++
				texId = 'tex-' + texIndex

				typeIndex = i + 1
				mathIndex = i + 2
				closeIndex = i + 3

				display = 'DISPLAY' == parts[typeIndex] ? 'block' : 'inline'

				children.push(
					<LaTeX
					  key={texId}
					  mathKey={texId}
					  itemId={itemId}
					  math={parts[mathIndex]}
					  display={display}
					/>
				)
			} else {
				children.push(
					<span
					  key={i}
					  className='preserve-whitespace'
					>
						{parts[i]}
					</span>
				)
			}
		}

		return (
			<span>
				{children}
			</span>
		)
	}
}
