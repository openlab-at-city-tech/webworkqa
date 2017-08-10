import React, { Component } from 'react'

const convertLinebreaks = ( text ) => {
	let chunkKey = 0
	return text.split( "\n" ).map( function(item) {
		chunkKey++
		return (
			<span key={'chunk-' + chunkKey}>
				{item}
				<br/>
			</span>
		)
	} )
}

const convertLinebreaksAsString = ( text ) => {
	return text.replace( /(?:\r\n|\r|\n)/g, '<br />' )
}

const collapseLinebreaks = ( text ) => {
	return text.replace( /((<br \/>)+)/, '<br />' )
}

export { convertLinebreaks, convertLinebreaksAsString, collapseLinebreaks }
