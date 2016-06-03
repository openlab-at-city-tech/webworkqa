import React from 'react';

var WWScoreDialog = React.createClass({
	render: function() {

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

		return (
			<div className="ww-score" style={styles.wwScore}>
				<div
					className={this.getClassName('up')}
					onClick={this.toggleUp}
					style={Object.assign(
						styles.uparrow,
						styles.arrow,
						(this.props.myvote == 'up') ? styles.myvoteup : {},
						(this.props.myvote == 'down' ) ? styles.disabledup : {}
					)}></div>
				<div
					className="ww-score-value"
					style={styles.wwScoreValue}
					>{this.props.score}</div>
				<div
					style={Object.assign(
						styles.downarrow,
						styles.arrow,
						(this.props.myvote == 'down') ? styles.myvotedown : {},
						(this.props.myvote == 'up' || this.props.score <= 0 ) ? styles.disableddown : {}

					)}
					className={this.getClassName('down')}
					onClick={this.toggleDown}
					></div>
			</div>
		);
	},

	toggleUp: function() {
		this.props.onVoteChange( 'up' );
	},

	toggleDown: function() {
		// Do nothing if the value is 0.
		if ( this.props.score > 0 ) {
			this.props.onVoteChange( 'down' );
		}
	},

	getClassName: function( mode ) {
		let className = 'ww-score-vote ww-score-' + mode;

		if ( this.props.myvote == mode ) {
			className += ' ww-myvote';
		}

		return className;
	}
});

export default WWScoreDialog;
