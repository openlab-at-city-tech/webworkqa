import React, { Component } from 'react';

export default class LaTeX extends Component {
	componentDidMount() {
		const { mathKey, problemId } = this.props

		const cssId = 'latex-' + problemId + '-' + mathKey

		if ( window.hasOwnProperty( 'MathJax' ) && window.MathJax.hasOwnProperty( 'Hub' ) ) {
			window.MathJax.Hub.Queue(["Update", window.MathJax.Hub, cssId]);
		}
	}

	shouldComponentUpdate() {
		return false
	}

	render() {
		const { mathKey, problemId, math, display } = this.props

		let type = 'math/tex';
		if ( 'block' == display ) {
			type += '; mode=display'
		}

		const cssId = 'latex-' + problemId + '-' + mathKey

		return (
			<script
			  type={type}
			  dangerouslySetInnerHTML={{__html: math}}
			  id={cssId}
			/>
		)
	}
}
