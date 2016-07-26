import fetch from 'isomorphic-fetch'

export const RECEIVE_RESPONSE = 'RECEIVE_RESPONSE'
const receiveResponse = (response) => {
	return {
		type: RECEIVE_RESPONSE,
		payload: response
	}
}

export const RECEIVE_RESPONSES = 'RECEIVE_RESPONSES'
export const receiveResponses = (responses) => {
	return {
		type: RECEIVE_RESPONSES,
		payload: responses
	}
}

export const RECEIVE_RESPONSE_ID_MAP = 'RECEIVE_RESPONSE_ID_MAP'
export const receiveResponseIdMap = (responseIdMap) => {
	return {
		type: RECEIVE_RESPONSE_ID_MAP,
		payload: responseIdMap
	}
}

export const RECEIVE_RESPONSE_ID_FOR_MAP = 'RECEIVE_RESPONSE_ID_FOR_MAP'
export const receiveResponseIdForMap = (responseId, questionId) => {
	return {
		type: RECEIVE_RESPONSE_ID_FOR_MAP,
		payload: {
			responseId,
			questionId
		}
	}
}

function sendResponseAnswered( responseId, isAnswered ) {
	return ( dispatch ) => {
		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		const endpoint = rest_api_endpoint + 'responses/' + responseId

		return fetch( endpoint, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': rest_api_nonce
			},
			body: JSON.stringify({
				is_answer: isAnswered
			})
		} )
			.then( response => response.json() )
			.then( json => {
				console.log( json )
			} );

	}
}

export const SET_RESPONSE_ANSWERED = 'SET_RESPONSE_ANSWERED'
const setResponseAnswered = ( responseId, isAnswered ) => {
	return {
		type: SET_RESPONSE_ANSWERED,
		payload: {
			responseId,
			isAnswered
		}
	}
}

export const CHANGE_RESPONSE_TEXT = 'CHANGE_RESPONSE_TEXT'
export const changeResponseText = ( questionId, value ) => {
	return {
		type: CHANGE_RESPONSE_TEXT,
		payload: {
			questionId,
			value
		}
	}
}

export const SET_RESPONSE_PENDING = 'SET_RESPONSE_PENDING'
export const setResponsePending = ( questionId, isPending ) => {
	return {
		type: SET_RESPONSE_PENDING,
		payload: {
			questionId,
			isPending
		}
	}
}

export const SET_RESPONSES_PENDING_BULK = 'SET_RESPONSES_PENDING_BULK'
export const setResponsesPendingBulk = ( pending ) => {
	return {
		type: SET_RESPONSES_PENDING_BULK,
		payload: pending
	}
}

export function sendResponse( questionId, value ) {
	return ( dispatch ) => {
		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		const endpoint = rest_api_endpoint + 'responses/'

		return fetch( endpoint, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': rest_api_nonce
			},
			body: JSON.stringify({
				question_id: questionId,
				value: value
			})
		} )
		.then( response => response.json() )
		.then( json => {
			dispatch( receiveResponse( json ) )
			dispatch( receiveResponseIdForMap( json.responseId, questionId ) )
			dispatch( setResponsePending( questionId, false ) )
			dispatch( changeResponseText( questionId, '' ) )
			// todo - handle errors

		} )
	}
}

export function clickAnswered( responseId, isAnswered ) {
	return ( dispatch ) => {
		dispatch( sendResponseAnswered( responseId, isAnswered ) )
		dispatch( setResponseAnswered( responseId, isAnswered ) )
	}
}
