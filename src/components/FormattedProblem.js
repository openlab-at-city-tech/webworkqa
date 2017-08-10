import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { convertLinebreaksAsString } from '../util/webwork-text-formatter.js'

export default class FormattedProblem extends Component {
	componentDidMount() {
		document.webwork_scaffold_init( ReactDOM.findDOMNode( this.refs.problem ) )
	}

	shouldComponentUpdate( nextProps, nextState ) {
		return nextProps.content !== this.props.content || nextProps.isVisible !== this.props.isVisible
	}

	render() {
		const { isVisible, itemId, content } = this.props

		if ( ! content ) {
			return ( <span></span> )
		}

		const texRegExp = /\{\{\{LATEX_DELIM_((?:DISPLAY)|(?:INLINE))_((?:OPEN)|(?:CLOSE))\}\}\}/gm
		let markup = content
		let toQueue = []

		markup = markup.replace( '&lt;', '<' )
		markup = markup.replace( '&gt;', '>' )

		markup = markup.replace( texRegExp, function( delim, mode, openOrClose ) {
			if ( 'CLOSE' == openOrClose ) {
				return '</script>'
			}

			let typeAttr = 'math/tex'
			if ( 'DISPLAY' == mode ) {
				typeAttr += ';mode=display'
			}

			if ( ! document.hasOwnProperty( 'latexIncrementor' ) ) {
				document.latexIncrementor = 1;
			}

			let cssId = 'latex-' + document.latexIncrementor
			toQueue.push( cssId )

			document.latexIncrementor = document.latexIncrementor + 1

			return '<script type="' + typeAttr + '" id="' + cssId + '">'
		} )

		markup = markup.replace( '{{{GEOGEBRA_PROBLEM}}}', '<div class="geogebra-placeholder">This problem contains interactive elements that cannot be displayed on the OpenLab. Please visit your WeBWorK course to see the full problem content.</div>' )

		// Line break substitution must skip <script> tags.
		markup = markup.replace( /(?!<script[^>]*?>)(?:\r\n|\r|\n)(?![^<]*?<\/script>)/g, '<br />' )

		if ( window.hasOwnProperty( 'MathJax' ) && window.MathJax.hasOwnProperty( 'Hub' ) ) {
			for ( var i = 0; i <= toQueue.length; i++ ) {
				window.MathJax.Hub.Queue(["Update", window.MathJax.Hub, toQueue[i] ]);
			}
		}

		return (
			<div
			  className="formatted-problem"
			  id={itemId}
			  dangerouslySetInnerHTML={{__html: markup}}
			  ref="problem"
			/>
		)
	}
}

FormattedProblem.defaultProps = {
	isVisible: true
}
