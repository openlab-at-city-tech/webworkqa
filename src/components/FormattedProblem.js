import React from 'react';

const FormattedProblem = React.createClass( {
	getDefaultProps: function() {
		return {
			isVisible: true
		}
	},

	shouldComponentUpdate: function( nextProps, nextState ) {
		return nextProps.content !== this.props.content || nextProps.isVisible !== this.props.isVisible
	},

	render: function() {
		const { isVisible, itemId, content } = this.props

		if ( ! content ) {
			return ( <span></span> )
		}

		const texRegExp = /\{\{\{LATEX_DELIM_((?:DISPLAY)|(?:INLINE))_((?:OPEN)|(?:CLOSE))\}\}\}/gm
		let markup = ''
		let toQueue = []

		markup = content.replace( texRegExp, function( delim, mode, openOrClose ) {
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

		if ( window.hasOwnProperty( 'MathJax' ) && window.MathJax.hasOwnProperty( 'Hub' ) ) {
			for ( var i = 0; i <= toQueue.length; i++ ) {
				window.MathJax.Hub.Queue(["Update", window.MathJax.Hub, toQueue[i] ]);
			}
		}

		return (
			<div 
			  className="formatted-problem"
			  dangerouslySetInnerHTML={{__html: markup}}
			/>
		)
	}
} )

export default FormattedProblem
