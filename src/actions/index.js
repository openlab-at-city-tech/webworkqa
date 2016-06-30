import fetch from 'isomorphic-fetch'

export const SET_APP_IS_LOADING = 'SET_APP_IS_LOADING'
export const setAppIsLoading = (appIsLoading) => {
	return {
		type: SET_APP_IS_LOADING,
		payload: {
			appIsLoading
		}
	}
}

export const REQUEST_PROBLEM = 'REQUEST_PROBLEM';
export const requestProblem = (problemId) => {
	return {
		type: REQUEST_PROBLEM,
		problemId
	}
}

export const RECEIVE_PROBLEM = 'RECEIVE_PROBLEM';
export const receiveProblem = (problemId, problem) => {
	const { ID, title, content } = problem
	return {
		type: RECEIVE_PROBLEM,
		payload: {
			ID,
			title,
			content
		}
	}
}

export const REQUEST_PROBLEMS = 'REQUEST_PROBLEMS';
export const requestProblems = (problems) => {
	return {
		type: REQUEST_PROBLEMS,
		payload: problems
	}
}

export const RECEIVE_PROBLEMS = 'RECEIVE_PROBLEMS'
export const receiveProblems = (problems) => {
	return {
		type: RECEIVE_PROBLEMS,
		payload: problems
	}
}

export function fetchProblems() {
	return dispatch => {
		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		const endpoint = rest_api_endpoint + 'problems/'
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
				dispatch( receiveProblems( json.problems ) )
				dispatch( receiveProblemIds( json.problemIds ) )
			} )
	}

}

export const RECEIVE_PROBLEM_IDS = 'RECEIVE_PROBLEM_IDS';
export const receiveProblemIds = (problemIds) => {
	return {
		type: RECEIVE_PROBLEM_IDS,
		payload: problemIds
	}
}

export const RECEIVE_QUESTION = 'RECEIVE_QUESTION'
export const receiveQuestion = (question) => {
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
export const receiveQuestionById = (questionId) => {
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

export function sendQuestion( problemId, content, tried ) {
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

export const RECEIVE_RESPONSE = 'RECEIVE_RESPONSE'
export const receiveResponse = (response) => {
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
export const setResponseAnswered = ( responseId, isAnswered ) => {
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

function sendVote(itemId, voteType) {
	return ( dispatch ) => {
		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		const endpoint = rest_api_endpoint + 'votes/'

		return fetch( endpoint, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': rest_api_nonce
			},
			body: JSON.stringify({
				item_id: itemId,
				value: voteType
			})
		} )
			.then( response => response.json() )
			.then( json => {
			//	console.log( json )
			} );

	}
}

export const SET_VOTE = 'SET_VOTE'
export const setVote = (itemId, voteType) => {
	return {
		type: SET_VOTE,
		payload: {
			itemId,
			voteType
		}
	}
}

export const SET_VOTES_BULK = 'SET_VOTES_BULK'
export const setVotesBulk = (votes) => {
	return {
		type: SET_VOTES_BULK,
		payload: votes
	}
}

export const TOGGLE_VOTE = 'TOGGLE_VOTE'
export const toggleVote = (itemId, voteType) => {
	return {
		type: TOGGLE_VOTE,
		payload: {
			itemId,
			voteType
		}
	}
}

export const INCR_SCORE = 'INCR_SCORE'
export const incrScore = (itemId, incr) => {
	return {
		type: INCR_SCORE,
		payload: {
			itemId,
			incr
		}
	}
}

export const SET_SCORE = 'SET_SCORE'
export const setScore = (itemId, score) => {
	return {
		type: SET_SCORE,
		payload: {
			itemId,
			score
		}
	}
}

export const SET_SCORES_BULK = 'SET_SCORES_BULK'
export const setScoresBulk = (scores) => {
	return {
		type: SET_SCORES_BULK,
		payload: scores
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

export const SET_INITIAL_LOAD_COMPLETE = 'SET_INITAL_LOAD_COMPLETE'
export const setInitialLoadComplete = ( isInitialLoadComplete ) => {
	return {
		type: SET_INITIAL_LOAD_COMPLETE,
		payload: isInitialLoadComplete
	}
}


export function clickVote( itemId, voteType ) {
	return ( dispatch ) => {
		dispatch( sendVote( itemId, voteType ) )
		dispatch( setVote( itemId, voteType ) )
	}
}

export function clickAnswered( responseId, isAnswered ) {
	return ( dispatch ) => {
		dispatch( sendResponseAnswered( responseId, isAnswered ) )
		dispatch( setResponseAnswered( responseId, isAnswered ) )
	}
}

export function fetchProblem( problemId ) {
	return dispatch => {

		// Reset a bunch of stuff.
		// Could work around this with a better-structured state (store all data per-problem)
		dispatch( setInitialLoadComplete( false ) )
		dispatch( receiveProblems( {} ) )
		dispatch( receiveQuestionsById( [] ) )
		dispatch( receiveResponseIdMap( {} ) )

		const { rest_api_endpoint, rest_api_nonce } = window.WWData
		const endpoint = rest_api_endpoint + 'problems/' + problemId

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
				const { problems, questions, questionsById, responseIdMap, responses, scores, votes } = json
				let score = 0;
				let vote = 0;

				dispatch( receiveProblems( problems ) )

				dispatch( receiveQuestions( questions ) )

				// Set "pending" status for response forms.
				let pending = {}
				questionsById.forEach( questionId => {
					pending[questionId] = false
				} )
				dispatch( setResponsesPendingBulk( pending ) )

				dispatch( receiveQuestionsById( questionsById ) )

				dispatch( receiveResponseIdMap( responseIdMap ) )
				dispatch( receiveResponses( responses ) )

				dispatch( setScoresBulk( scores ) )
				dispatch( setVotesBulk( votes ) )

				dispatch( setInitialLoadComplete( true ) )
				dispatch( setAppIsLoading( false ) )
			} )
	}

}
