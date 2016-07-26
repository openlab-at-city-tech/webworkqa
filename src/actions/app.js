export const SET_INITIAL_LOAD_COMPLETE = 'SET_INITAL_LOAD_COMPLETE'
export const setInitialLoadComplete = ( isInitialLoadComplete ) => {
	return {
		type: SET_INITIAL_LOAD_COMPLETE,
		payload: isInitialLoadComplete
	}
}

export const SET_APP_IS_LOADING = 'SET_APP_IS_LOADING'
export const setAppIsLoading = (appIsLoading) => {
	return {
		type: SET_APP_IS_LOADING,
		payload: {
			appIsLoading
		}
	}
}

export const TOGGLE_ACCORDION = 'TOGGLE_ACCORDION'
export const toggleAccordion = ( itemId ) => {
	return {
		type: TOGGLE_ACCORDION,
		payload: {
			itemId
		}
	}
}

export function processFilterToggle( slug, contrary ) {
	return ( dispatch, getState ) => {
		const { currentFilters } = getState()

		if ( currentFilters[ slug ] ) {
			// If already clicked, toggle off.
			dispatch( setFilterToggle( slug, false ) )
		} else {
			// If not clicked, toggle on, and toggle off contrary.
			dispatch( setFilterToggle( slug, true ) )
			dispatch( setFilterToggle( contrary, false ) )
		}
	}
}

export const SET_FILTER_TOGGLE = 'SET_FILTER_TOGGLE'
export const setFilterToggle = ( slug, value ) => {
	return {
		type: SET_FILTER_TOGGLE,
		payload: {
			slug,
			value
		}
	}
}

