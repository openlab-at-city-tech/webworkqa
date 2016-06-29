import React, { Component } from 'react';
import { Link } from 'react-router'
import LaTeX from './LaTeX'
import Input from './Input'

export default class FormattedProblem extends Component {
	render() {
		const { problemId, content, excerpt, inputs, maths } = this.props

		if ( ! content ) {
			return ( <span></span> )
		}

		const parts = content.split( /(\{\{\{[a-z]+_[0-9]?\}\}\})/g)
		let children = []
		var num, theMath, theInput
		for ( var i = 0; i < parts.length; i++ ) {
			var match = parts[i].match( /\{\{\{([a-z]+)_([0-9]?)\}\}\}/ )
			if ( match ) {
				switch ( match[1] ) {
					case 'math' :
						num = parseInt( match[2] )
						theMath = maths[num]
						children.push( <LaTeX
								key={i}
								mathKey={i}
								problemId={problemId}
								math={theMath.math}
								display={theMath.display}
								/> )
						break

					case 'input' :
						num = parseInt( match[2] )
						theInput = inputs[num]
						children.push( <Input key={i} type={theInput.type} value={theInput.type} /> )
						break
				}

			} else {
				children.push( <span key={i}>{parts[i]}</span> )
			}
		}

		return (
			<span>
				{children}
			</span>
		)
	}
}
