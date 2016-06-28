import React, { Component } from 'react';

export default class LaTeX extends Component {
	componentDidMount() {
		window.MathJax.Hub.Process( document.getElementsByTagName( 'script' ) )
	}

	render() {
		const { math, display } = this.props

		let type = 'math/tex';
		if ( 'block' == display ) {
			type += '; mode=display'
		}

		return (
			<script
			  type={type}
			  dangerouslySetInnerHTML={{__html: math}}
			/>
		)
	}
}
