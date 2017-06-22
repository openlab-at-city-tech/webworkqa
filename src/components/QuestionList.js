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
		let generated = {}
		questionsById.forEach(function(questionId) {
			if ( generated.hasOwnProperty( questionId ) ) {
				return
			}

			rows.push(
				<QuestionContainer
				  itemId={questionId}
				  key={questionId}
				/>
			);

			generated[ questionId ] = 1
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
