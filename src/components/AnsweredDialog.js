import React, { Component } from 'react'

export default class AnsweredDialog extends React.Component {
	render() {
		const { responseId, onAnsweredClick, isAnswered } = this.props

		var styles = {
			wwScore: {
				width: '40px',
				float: 'left'
			},
			arrow: {
				width: '0px',
				height: '0px',
				borderLeft: '20px solid transparent',
				borderRight: '20px solid transparent',
			},
			uparrow: {
				borderBottom: '20px solid #999'
			},
			downarrow: {
				borderTop: '20px solid #999'
			},
			myvoteup: {
				borderBottom: '20px solid #000'
			},
			myvotedown: {
				borderTop: '20px solid #000'
			},
			disabledup: {
				borderBottom: '20px solid #ddd'
			},
			disableddown: {
				borderTop: '20px solid #ddd'
			},
			wwScoreValue: {
				textAlign: 'center'
			}
		}

		return (
			<div className="ww-answered">
				<label>
					<input
						type="checkbox"
						checked={isAnswered}
						onClick={ e => {
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
