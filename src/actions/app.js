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

export const SET_COLLAPSED = 'SET_COLLAPSED'
export const setCollapsed = ( itemId, value = null ) => {
	return {
		type: SET_COLLAPSED,
		payload: {
			itemId,
			value
		}
	}
}

export const SET_COLLAPSED_BULK = 'SET_COLLAPSED_BULK'
export const setCollapsedBulk = ( c = [] ) => {
	return {
		type: SET_COLLAPSED_BULK,
		payload: c
	}
}

export function processFilterChange( slug, value ) {
	return ( dispatch ) => {
		dispatch( setViewType( 'results' ) )
		dispatch( setFilterToggle( slug, value ) )
	}
}

export const RESET_CURRENT_FILTERS = 'RESET_CURRENT_FILTERS'
export const resetCurrentFilters = () => {
	return {
		type: RESET_CURRENT_FILTERS,
		payload: {}
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

export const SET_SORT_ORDERBY = 'SET_SORT_ORDERBY'
export const setSortOrderby = ( orderby ) => {
	const order = 'DESC'

	return {
		type: SET_SORT_ORDERBY,
		payload: {
			orderby,
			order
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

export const SET_TEXTAREA_VALUE = 'SET_TEXTAREA_VALUE'
export const setTextareaValue = ( fieldName, value ) => {
	return {
		type: SET_TEXTAREA_VALUE,
		payload: {
			fieldName,
			value
		}
	}
}

