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

export const TOGGLE_ACCORDION = 'TOGGLE_ACCORDION'
export const toggleAccordion = ( itemId ) => {
	return {
		type: TOGGLE_ACCORDION,
		payload: {
			itemId
		}
	}
}

export function clickVote( itemId, voteType ) {
	return ( dispatch ) => {
		dispatch( sendVote( itemId, voteType ) )
		dispatch( setVote( itemId, voteType ) )
	}
}

function doFetchProblem( problemId ) {
	return dispatch => {
		return fetch( `http://boone.cool/wpmaster/wp-json/webwork/v1/problems/${problemId}`,
		{
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': window.WWData.rest_api_nonce
			},
		} )
			.then( response => response.json() )
			.then( json => {
				const { problem, questions, questionsById, responseIdMap, responses, scores, votes } = json
				let score = 0;
				let vote = 0;

				dispatch( receiveProblem( problemId, problem ) )

				// must dispatch first so that questions can render properly
				dispatch( receiveResponseIdMap( responseIdMap ) )
				dispatch( receiveResponses( responses ) )
				dispatch( receiveQuestions( questions ) )
				dispatch( receiveQuestionsById( questionsById ) )

				// Assemble a flat list of all scored items.
				let scoredItemIds = questionsById
				console.log(questionsById)
				questionsById.forEach( ( questionId ) => {
					if ( responseIdMap.hasOwnProperty( questionId ) ) {
						scoredItemIds = scoredItemIds.concat( responseIdMap[ questionId ] )
					}
				} )

				scoredItemIds.forEach( ( itemId ) => {
					if ( scores.hasOwnProperty( itemId ) ) {
						score = scores[ itemId ]
					}
					dispatch( setScore( itemId, score ) )

					if ( votes.hasOwnProperty( itemId ) ) {
						vote = votes[ itemId ]
					}
					dispatch( setVote( itemId, vote ) )
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
