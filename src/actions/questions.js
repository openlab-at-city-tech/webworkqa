import fetch from 'isomorphic-fetch'

export function fetchQuestionIndexList() {
	return dispatch => {
		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		let endpoint = rest_api_endpoint + 'questions/'

		endpoint += '?orderby=post_date&order=desc'

		return fetch( endpoint,
		{
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': rest_api_nonce
			},
		} )
			.then( response => response.json() )
			.then( json => {
				dispatch( receiveQuestions( json.questions ) )
				dispatch( receiveQuestionIds( json.questionIds ) )
			} )
	}

}

export const RECEIVE_QUESTION_IDS = 'RECEIVE_QUESTION_IDS';
const receiveQuestionIds = (questionIds) => {
	return {
		type: RECEIVE_QUESTION_IDS,
		payload: questionIds
	}
}

export const RECEIVE_QUESTION = 'RECEIVE_QUESTION'
const receiveQuestion = (question) => {
	return {
		type: RECEIVE_QUESTION,
		payload: question
	}
}

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const receiveQuestions = (questions) => {
	return {
		type: RECEIVE_QUESTIONS,
		payload: questions
	}
}

export const RECEIVE_QUESTION_BY_ID = 'RECEIVE_QUESTION_BY_ID'
const receiveQuestionById = (questionId) => {
	return {
		type: RECEIVE_QUESTION_BY_ID,
		payload: {
			questionId
		}
	}
}

export const RECEIVE_QUESTIONS_BY_ID = 'RECEIVE_QUESTIONS_BY_ID'
export const receiveQuestionsById = (questionsById) => {
	return {
		type: RECEIVE_QUESTIONS_BY_ID,
		payload: questionsById
	}
}

export const CHANGE_QUESTION_TEXT = 'CHANGE_QUESTION_TEXT'
export const changeQuestionText = ( fieldName, value ) => {
	return {
		type: CHANGE_QUESTION_TEXT,
		payload: {
			fieldName,
			value
		}
	}
}

export const SET_QUESTION_PENDING = 'SET_QUESTION_PENDING'
export const setQuestionPending = ( isPending ) => {
	return {
		type: SET_QUESTION_PENDING,
		payload: {
			isPending
		}
	}
}

export function sendQuestion( problemId, content, tried, problemText ) {
	return ( dispatch ) => {
		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		const endpoint = rest_api_endpoint + 'questions/'

		return fetch( endpoint, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': rest_api_nonce
			},
			body: JSON.stringify({
				problem_id: problemId,
				content,
				problem_text: problemText,
				tried
			})
		} )
		.then( response => response.json() )
		.then( json => {
			dispatch( setQuestionPending( false ) )
			dispatch( receiveQuestionById( json.questionId ) )
			dispatch( receiveQuestion( json ) )
			dispatch( changeQuestionText( 'content', '' ) )
			dispatch( changeQuestionText( 'tried', '' ) )
			// todo - handle errors
		} )
	}
}
