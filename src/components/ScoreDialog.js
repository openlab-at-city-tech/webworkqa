import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

export default class ScoreDialog extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { isSingleProblem, itemId, onVoteClick, userCanVote, vote } = this.props

		let score = this.props.score

		switch ( vote ) {
			case 'up' :
				score++
				break

			case 'down' :
				score--
				break
		}

		let scoreClass = 'ww-score'

		scoreClass += userCanVote && isSingleProblem ? ' can-vote' : ' cannot-vote'
		scoreClass += score > 0 ? ' has-votes' : ' has-no-votes'
		scoreClass += 'up' === vote ? ' liked-by-me' : ' not-liked-by-me'

		const scoreText = 'Number of votes: ' + score

		let iconClass = 'score-icon fa'
		let voteText
		if ( userCanVote && isSingleProblem ) {
			if ( 'up' === vote ) {
				voteText = 'Click to remove vote'
			} else {
				voteText = 'Click to vote'
			}
		} else {
			voteText = 'Join / login to like'
		}

		const iconElement = <i aria-hidden="true" className={iconClass}></i>

		let voteElement

		const voteButtonIsDisabled = ! userCanVote || ! isSingleProblem

		const srElement = <span className="screen-reader-text">{voteText}</span>
		voteElement = (
			<button
				aria-label={voteText}
				disabled={voteButtonIsDisabled}
				onClick={ (e) => {
					e.preventDefault()

					if ( ! voteButtonIsDisabled ) {
						onVoteClick( itemId, ( vote === 'up' ) ? '' : 'up' )
					}
				} }
			>
			{iconElement}
			<span className="screen-reader-text">{voteText}</span>
			</button>
		)

		let tooltip
		if ( ! userCanVote ) {
			tooltip = <ReactTooltip id='vote-element' type='info' className='login-tooltip'>{voteText}</ReactTooltip>
		}

		return (
			<div className={scoreClass}>
				<span className="ww-score-value">
					{score}
					<span className="screen-reader-text">{scoreText}</span>
				</span>

				{/* span wrapper is to allow tooltip on disabled button */}
				<span data-tip data-for='vote-element'>
					{voteElement}
				</span>
				{tooltip}
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
