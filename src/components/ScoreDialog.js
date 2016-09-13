import React, { Component } from 'react'
import { connect } from 'react-redux'

export default class ScoreDialog extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { itemId, onVoteClick, userCanVote, vote } = this.props

		let score = this.props.score

		switch ( vote ) {
			case 'up' :
				score++
				break

			case 'down' :
				score--
				break
		}

		const scoreText = 'Number of votes: ' + score

		let heartClass = 'fa'
		let voteText
		if ( userCanVote ) {
			if ( 'up' === vote ) {
				heartClass += ' fa-heart'
				voteText = 'Click to remove vote'
			} else {
				heartClass += ' fa-heart-o'
				voteText = 'Click to vote'
			}
		} else {
			heartClass += ' fa-heart'
		}

		const heartElement = <i aria-hidden="true" className={heartClass}></i>

		let voteElement
		if ( userCanVote ) {
			const srElement = <span className="screen-reader-text">{voteText}</span>
			voteElement = (
				<button
				  onClick={ (e) => {
					e.preventDefault()
					onVoteClick( itemId, ( vote === 'up' ) ? '' : 'up' )
				  } }
				>
					{heartElement}
					{srElement}
				</button>
			)
		} else {
			voteElement = (
				<span className="score-display-only">
					{heartElement}
				</span>
			)
		}

		return (
			<div className="ww-score">
				<span className="ww-score-value">
					{score}
					<span className="screen-reader-text">{scoreText}</span>
				</span>

				{voteElement}
			</div>
		);
	}

	getClassName( mode ) {
		let className = 'ww-score-vote ww-score-' + mode;

		// @todo make this function pure
		if ( this.props.myvote == mode ) {
			className += ' ww-myvote';
		}

		return className;
	}
}
