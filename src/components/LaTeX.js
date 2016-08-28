import React, { Component } from 'react';

export default class LaTeX extends Component {
	componentDidMount() {
		this.updateTeX()
	}

	componentDidUpdate() {
		this.updateTeX()
	}

	updateTeX() {
		const { mathKey, itemId, isVisible } = this.props

		if ( ! isVisible ) {
			return
		}

		const cssId = 'latex-' + itemId + '-' + mathKey

		if ( window.hasOwnProperty( 'MathJax' ) && window.MathJax.hasOwnProperty( 'Hub' ) ) {
			window.MathJax.Hub.Queue(["Update", window.MathJax.Hub, cssId]);
		}
	}

	shouldComponentUpdate( nextProps ) {
		return this.props.math !== nextProps.math
	}

	render() {
		const { mathKey, itemId, math, display } = this.props

		let type = 'math/tex';
		if ( 'block' == display ) {
			type += '; mode=display'
		}

		const cssId = 'latex-' + itemId + '-' + mathKey

		return (
			<script
			  type={type}
			  dangerouslySetInnerHTML={{__html: math}}
			  id={cssId}
			/>
		)
	}
}
