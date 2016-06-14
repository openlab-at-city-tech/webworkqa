import fetch from 'isomorphic-fetch'

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

export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const receiveQuestions = (questions) => {
	return {
		type: RECEIVE_QUESTIONS,
		payload: questions
	}
}

export const RECEIVE_QUESTIONS_BY_ID = 'RECEIVE_QUESTIONS_BY_ID'
export const receiveQuestionsById = (questionsById) => {
	return {
		type: RECEIVE_QUESTIONS_BY_ID,
		payload: questionsById
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

export function clickVote( itemId, voteType ) {
	return ( dispatch ) => {
		dispatch( setVote( itemId, voteType ) );

		let incr = 0;
		if ( 'up' === voteType ) {
			incr = 1
		} else if ( 'down' === voteType ) {
			incr = -1
		}

		dispatch( incrScore( itemId, incr ) )
	}
}

function doFetchProblem( problemId ) {
	return dispatch => {
		return fetch( `http://boone.cool/wpmaster/wp-json/webwork/v1/problems/${problemId}`)
			.then( response => response.json() )
			.then( json => {
				const { problem, questions, questionsById, scores, votes } = json

				dispatch( receiveProblem( problemId, problem ) )
				dispatch( receiveQuestions( questions ) )
				dispatch( receiveQuestionsById( questionsById ) )

				questionsById.forEach( ( itemId ) => {
					if ( scores.hasOwnProperty( itemId ) ) {
						dispatch( setScore( itemId, scores[itemId] ) )
					}

					if ( votes.hasOwnProperty( itemId ) ) {
						dispatch( setVote( itemId, votes[itemId] ) )
					}
				} );
			} )
	}

}

export function fetchProblem( problemId ) {
	return dispatch => {
		requestProblem( problemId );
		return dispatch( doFetchProblem( problemId ) )
	}
	/*
	return dispatch => {
		// Inform app that the request has begun.

		return doFetchProblem( problemId )
			.then( response => response.json() )
			.then( json => dispatch( receiveProblem( problemId, json ) ) )
	}
	*/
}
