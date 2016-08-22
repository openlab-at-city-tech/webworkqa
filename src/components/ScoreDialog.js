import React, { Component } from 'react'
import { connect } from 'react-redux'

export default class ScoreDialog extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { itemId, onVoteClick, scores, userCanVote, votes } = this.props

		const myVote = votes.hasOwnProperty( itemId ) ? votes[ itemId ] : '';
		let score = scores.hasOwnProperty( itemId ) ? scores[ itemId ] : 0;

		switch ( myVote ) {
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
		if ( 'up' === myVote ) {
			heartClass += ' fa-heart'
			voteText = 'Click to remove vote'
		} else {
			heartClass += ' fa-heart-o'
			voteText = 'Click to vote'
		}

		const heartElement = <i aria-hidden="true" className={heartClass}></i>
		const srElement = <span className="screen-reader-text">{voteText}</span>

		let voteElement
		if ( userCanVote ) {
			voteElement = (
				<button
				  onClick={ (e) => {
					e.preventDefault()
					onVoteClick( itemId, ( myVote === 'up' ) ? '' : 'up' )
				  } }
				>
					{heartElement}
					{srElement}
				</button>
			)
		} else {
			voteElement = (
				<span>
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
