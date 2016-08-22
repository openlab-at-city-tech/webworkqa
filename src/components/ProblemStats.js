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
			if ( responses.hasOwnProperty( responseId ) && responses[responseId].isAnswer ) {
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

		return (
			<div className="item-stats problem-stats">
				<span className="ww-subtitle-section">{questionCount} questions</span>
				<span className="ww-subtitle-sep">/</span>
				<span className="ww-subtitle-section">{responseCount} responses</span>
				<span className="ww-subtitle-sep">/</span>
				<span className="ww-subtitle-section">{unansweredCount} unanswered</span>
			</div>
		)
	}
}
