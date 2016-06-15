import React, { Component } from 'react'
import { connect } from 'react-redux'

class WWScoreDialog extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { dispatch, handleToggleVote, itemId } = this.props

		var styles = {
			wwScore: {
				width: '40px',
				float: 'left'
			},
			arrow: {
				width: '0',
				height: '0',
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

		let myVote = this.props.myVote
		let score = this.props.score
		switch ( myVote ) {
			case 'up' :
				score++
				break

			case 'down' :
				score--
				break
		}

		return (
			<div className="ww-score" style={styles.wwScore}>
				<div
					className={this.getClassName('up')}
					data-item-id={itemId}
					onClick={ e => {
						// Don't allow 'up' click directly from 'down'.
						if ( 'down' !== myVote ) {
							handleToggleVote(
								e.target.dataset.itemId,
								( myVote == 'up' ? '' : 'up' )
							)
						}
					} }
					style={Object.assign(
						styles.uparrow,
						styles.arrow,
						(myVote == 'up') ? styles.myvoteup : {},
						(myVote == 'down' ) ? styles.disabledup : {}
					)}></div>
				<div
					className="ww-score-value"
					style={styles.wwScoreValue}
					>{score}</div>
				<div
					style={Object.assign(
						styles.downarrow,
						styles.arrow,
						(myVote == 'down') ? styles.myvotedown : {},
						(myVote == 'up' || score <= 0 ) ? styles.disableddown : {}

					)}
					className={this.getClassName('down')}
					data-item-id={itemId}
					onClick={ e => {
						// Don't allow 'down' click directly from 'up'.
						if ( 'up' !== myVote ) {
							handleToggleVote(
								e.target.dataset.itemId,
								( myVote == 'down' ? '' : 'down' )
							)
						}
					} }
					></div>
			</div>
		);
	}

	toggleDown() {
		// Do nothing if the value is 0.
		if ( this.props.score > 0 ) {
			this.props.onVoteChange( 'down' );
		}
	}

	getClassName( mode ) {
		let className = 'ww-score-vote ww-score-' + mode;

		if ( this.props.myvote == mode ) {
			className += ' ww-myvote';
		}

		return className;
	}
}

function mapStateToProps( state ) {
	return {}
}

export default connect( mapStateToProps )( WWScoreDialog );
