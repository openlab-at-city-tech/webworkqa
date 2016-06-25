import React, { Component } from 'react'

export default class ProblemStats extends Component {
	render() {
		const { questionsById, responseIdMap, responses } = this.props

		const questionCount = questionsById.length

		let responseCount = 0
		for ( var questionId in responseIdMap ) {
			if ( responseIdMap.hasOwnProperty( questionId ) ) {
				responseCount += responseIdMap[questionId].length
			}
		}

		let answered = {}
		for ( var responseId in responses ) {
			if ( responses.hasOwnProperty( responseId ) ) {
				// Will be overwritten for other responses to same question
				answered[ responses[responseId].questionId ] = responseId
			}
		}

		let answeredCount = 0
		for ( var questionId in answered ) {
			if ( answered.hasOwnProperty( questionId ) ) {
				answeredCount++
			}
		}

		const unansweredCount = questionsById.length - answeredCount
		console.log( 'just did math' )

		return (
			<div className="problem-stats">
				<div>{questionCount} questions</div>
				<div> {responseCount} responses</div>
				<div>{unansweredCount} unanswered</div>
			</div>
		)
	}
}
