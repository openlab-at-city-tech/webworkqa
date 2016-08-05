import React, { Component } from 'react';
import { Link } from 'react-router'
import LaTeX from './LaTeX'

export default class FormattedProblem extends Component {
	render() {
		const { itemId, content, maths } = this.props

		if ( ! content ) {
			return ( <span></span> )
		}

		const parts = content.split( /(\{\{\{[a-z]+_[0-9]?\}\}\})/g)
		let children = []
		var num, theMath
		for ( var i = 0; i < parts.length; i++ ) {
			var match = parts[i].match( /\{\{\{([a-z]+)_([0-9]?)\}\}\}/ )
			if ( match ) {
				switch ( match[1] ) {
					case 'math' :
						num = parseInt( match[2] )

						if ( maths && maths.hasOwnProperty( num ) ) {
							theMath = maths[num]
							children.push(
								<LaTeX
								  key={i}
								  mathKey={i}
								  itemId={itemId}
								  math={theMath.math}
								  display={theMath.display}
								/>
							)
						}
						break
				}

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
