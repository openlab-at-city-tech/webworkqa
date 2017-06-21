import { fetchProblem } from './problems'
import { fetchQuestionIndexList } from './questions'

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
		dispatch( setFilterToggle( slug, value ) )
		dispatch( fetchQuestionIndexList( false ) )
	}
}

export const REBUILD_HASH = 'REBUILD_HASH'
export function rebuildHash() {
	return {
		type: REBUILD_HASH
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
//	window.location.hash = 'results'

	// Or this.
	if ( '' == value ) {
		value = false
	}

	return {
		type: SET_FILTER_TOGGLE,
		payload: {
			slug,
			value
		}
	}
}

export function processOrderbyChange( orderby, problemId ) {
	return ( dispatch ) => {
		dispatch( setSortOrderby( orderby ) )

		// This suggests that the handler should belong to the QuestionContainer
		// and ProblemContainer. Passing this param feels icky.
		if ( problemId ) {
			dispatch( fetchProblem( problemId ) )
		} else {
			dispatch( fetchQuestionIndexList( false ) )
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
