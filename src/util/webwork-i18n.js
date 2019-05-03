const getString = ( index ) => {
	return window.WWData.strings.hasOwnProperty( index ) ? window.WWData.strings[ index ] : '';
}

export { getString }
