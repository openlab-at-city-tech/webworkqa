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

		dispatch( setViewType( 'results' ) )
	}
}

export function processFilterChange( slug, value ) {
	return ( dispatch ) => {
		dispatch( setFilterToggle( slug, value ) )
		dispatch( setViewType( 'results' ) )
	}
}

export const SET_FILTER_TOGGLE = 'SET_FILTER_TOGGLE'
export const setFilterToggle = ( slug, value ) => {
	// Don't tell the Redux gods about this.
	window.location.hash = 'results'

	return {
		type: SET_FILTER_TOGGLE,
		payload: {
			slug,
			value
		}
	}
}

export const RECEIVE_FILTER_OPTIONS = 'RECEIVE_FILTER_OPTIONS'
export const receiveFilterOptions = ( filterOptions ) => {
	return {
		type: RECEIVE_FILTER_OPTIONS,
		payload: filterOptions
	}
}

export const SET_VIEW_TYPE = 'SET_VIEW_TYPE'
export const setViewType = ( viewType, objectId = null ) => {
	return {
		type: SET_VIEW_TYPE,
		payload: {
			viewType,
			objectId
		}
	}
}

