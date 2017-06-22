import React, { Component } from 'react'
import QuestionContainer from '../containers/QuestionContainer'

export default class QuestionList extends Component {
	render() {
		const { questionsById } = this.props

		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};
		let rows = []

		let rowKey
		questionsById.forEach(function(questionId) {
			console.log(questionId)
			rows.push(
				<QuestionContainer
				  itemId={questionId}
				  key={questionId}
				/>
			);
		});

		return (
			<div className="ww-question-list">
				<h2 className="ww-header">Questions & Replies</h2>
				<p className="ww-question-gloss ww-qr-gloss">
					NOTE: values may be different than those presented in your problem.
				</p>
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
}
