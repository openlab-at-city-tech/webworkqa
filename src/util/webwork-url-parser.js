const getCurrentHash = ( router ) => {
	return ( null === router.locationBeforeTransitions ) ? window.location.hash : router.locationBeforeTransitions.hash
}

const getCurrentView = ( router ) => {
	const hash = getCurrentHash( router )

	const rawParams = hash.split( ':' )
	let params = {}
	let paramParts
	for ( var i in rawParams ) {
		paramParts = rawParams[ i ].split( '=' )

		// All params must have values. Leading '#' will not.
		if ( 1 === paramParts.length ) {
			continue
		}

		params[ paramParts[0] ] = paramParts[1]
	}

	return params
}

export { getCurrentHash, getCurrentView }
