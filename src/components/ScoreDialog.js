import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

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

		let iconClass = 'score-icon fa'
		let voteText
		if ( userCanVote ) {
			if ( 'up' === vote ) {
				iconClass += ' fa-thumbs-up'
				voteText = 'Click to remove vote'
			} else {
				iconClass += ' fa-thumbs-o-up'
				voteText = 'Click to vote'
			}
		} else {
			iconClass += ' fa-thumbs-up'
			voteText = 'Join / login to like'
		}

		const iconElement = <i aria-hidden="true" className={iconClass}></i>

		let voteElement

		const srElement = <span className="screen-reader-text">{voteText}</span>
		voteElement = (
			<button
				disabled={! userCanVote}
				onClick={ (e) => {
					e.preventDefault()
					onVoteClick( itemId, ( vote === 'up' ) ? '' : 'up' )
				} }
			>
			{iconElement}
			<span className="screen-reader-text">{voteText}</span>
			</button>
		)

		return (
			<div className="ww-score">
				<span className="ww-score-value">
					{score}
					<span className="screen-reader-text">{scoreText}</span>
				</span>

				{/* span wrapper is to allow tooltip on disabled button */}
				<span data-tip data-for='vote-element'>
					{voteElement}
				</span>
				<ReactTooltip id='vote-element' type='info' className='login-tooltip'>{voteText}</ReactTooltip>
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
