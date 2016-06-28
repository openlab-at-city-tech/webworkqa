import React, { Component } from 'react'

export default class AnsweredDialog extends React.Component {
	render() {
		const { responseId, onAnsweredClick, isAnswered } = this.props

		return (
			<div className="ww-answered">
				<label>
					<input
						type="checkbox"
						checked={isAnswered}
						onChange={ e => {
							onAnsweredClick( responseId, ! isAnswered )
						} }
						value="1"
					/>
					This response answered my question!
				</label>
			</div>
		)
	}
}
