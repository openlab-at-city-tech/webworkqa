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

		return (
			<div className="item-stats problem-stats">
				<span className="ww-subtitle-section">{questionCount} questions</span>
				<span className="ww-subtitle-sep">/</span>
				<span className="ww-subtitle-section">{responseCount} responses</span>
			</div>
		)
	}
}
