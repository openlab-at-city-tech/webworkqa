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

function sendVote(itemId, voteType) {
	return ( dispatch ) => {
		return fetch( 'http://boone.cool/wpmaster/wp-json/webwork/v1/votes/', {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': window.WWData.rest_api_nonce
			},
			body: JSON.stringify({
				item_id: itemId,
				value: voteType
			})
		} )
			.then( response => response.json() )
			.then( json => {
				console.log( json )
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

export function clickVote( itemId, voteType ) {
	return ( dispatch ) => {

		// scores store should show saved score *excluding current user*
		// to display, we add current user's vote + saved score
		// the below feels like it ought to be a dispatch chain
		// ajax will have to happen somewhere in here. Not clear how that works yet
		dispatch( sendVote( itemId, voteType ) )
		dispatch( toggleVote( itemId, voteType ) )
		dispatch( incrScore( itemId, voteType ) )
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
}
