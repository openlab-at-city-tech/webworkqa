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

		return (
			<div className="ww-score">
				<input
				  type="checkbox"
				  checked={myVote == 'up'}
				  disabled={! userCanVote}
				  value={itemId}
				  onChange={ e => {
					onVoteClick( e.target.value, ( myVote === 'up' ) ? '' : 'up' )
				  } }
				/>

				<span className="ww-score-value">
					{score}
				</span>

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
