import React from 'react';
import ReactDOM from 'react-dom';

import Redux from 'redux';
import ReduxReact from 'react-redux';

//import 'bootstrap-webpack';
//import Widget from './components/widget';

// Query DOM for all widget wrapper divs
//let widgets = document.querySelectorAll( 'div.react-demo-wrapper' );
//widgets = Array.prototype.slice.call( widgets );

/**
 * Higher order component implementing the vote getting functionality.
 *
 * Add to component Foo:
 *     Foo = connectToVoteGetter( Foo );
 */
var connectToVoteGetter = function( Component ) {
	const VoteGetter = React.createClass({
		getInitialState: function() {
			return {
				score: '0',
				myvote: ''
			}
		},

		toggleVote: function( mode ) {
			// ajax should send the request out and then toggle back to the previous state if it fails
			let scoreinc = ( mode == 'down' ) ? -1 : 1;

			if ( this.state.myvote === mode ) {
				this.modScore( 0 - scoreinc );
				this.setMyVote( '' );
			} else if ( this.state.myvote === '' ) {
				this.modScore( scoreinc );
				this.setMyVote( mode );
			}
		},

		modScore: function( val ) {
			val = ( 1 == val ) ? 1 : -1;
			this.setState( {
				score: parseInt( this.state.score ) + val
			} );
		},

		setMyVote: function( vote ) {
			this.setState( { myvote: vote } );
		},

		render: function() {
			return <Component {...this.props} {...this.state} onVoteChange={this.toggleVote} />
		}
	});

	return VoteGetter;
};

var WWProblem = React.createClass({
	render: function() {
		return (
			<div className="ww-problem">
				<h2>{this.props.problem_data.title}</h2>
				<WWProblemSummary content={this.props.problem_data.summary} />

				<WWAskQuestion problem_id={this.props.problem_data.id} />

				<WWQuestionList problem_id={this.props.problem_data.id} questions={this.props.problem_data.questions} />
			</div>
		);
	}
});

var WWProblemSummary = React.createClass({
	render: function() {
		return (
			<div className="ww-problem-summary">
				{this.props.content}
			</div>
		);
	}
});

var WWAskQuestion = React.createClass({
	render: function() {
		return (
			<div className="ww-ask-question-form">
				<form>
					<h3>Ask a Question</h3>
					<input type="hidden" name="ww-problem-id" value={this.props.problem_id} />
					<textarea name="ww-question-content" value="" />
					<input type="submit" value="Submit!" />
				</form>
			</div>
		);
	}
});

var WWQuestionList = React.createClass({
	render: function() {
		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};

		var rows = [];
		this.props.questions.forEach(function(question) {
			rows.push( <WWQuestion key={question.id} question={question} /> );
		});
		return (
			<div className="ww-question-list">
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
});

var WWQuestion = React.createClass({
	render: function() {
		var styles = {
			li: {
				overflow: 'hidden',
				marginBottom: '15px'
			},
			wwQuestionContent: {
				paddingLeft: '50px'
			}
		};

		return (
			<li style={styles.li}>
				<WWScoreDialog
					score={this.props.score}
					myvote={this.props.myvote}
					onVoteChange={this.props.onVoteChange}
				/>

				<div className="ww-question-content" style={styles.wwQuestionContent}>
					{this.props.question.content}

					<WWResponseList responses={this.props.question.responses} />
				</div>
			</li>
		);
	}
});

// Make a vote getter.
WWQuestion = connectToVoteGetter( WWQuestion );

var WWResponseList = React.createClass({
	render: function() {
		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};

		var rows = [];
		this.props.responses.forEach( function(response) {
			rows.push( <WWResponse key={response.id} response={response} /> );
		});

		return (
			<div className="ww-response-list">
				<h3>Responses</h3>
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
});

var WWResponse = React.createClass({
	render: function() {
		var styles = {
			li: {
				overflow: 'hidden',
				marginBottom: '15px'
			},
			wwResponseContent: {
				paddingLeft: '50px'
			}
		};
		return (
			<li style={styles.li}>
				<WWScoreDialog
					score={this.props.score}
					myvote={this.props.myvote}
					onVoteChange={this.props.onVoteChange}
				/>
				<div className="ww-response-content" style={styles.wwResponseContent}>
					{this.props.response.content}
				</div>
			</li>
		);
	}
});

WWResponse = connectToVoteGetter( WWResponse );

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

var problem_data = {
	id: 1234,
	title: 'This is the title of my problem',
	summary: 'A bunch of math shit',
	questions: [
		{
			id: 456,
			content: 'THis is the first question',
			score: 4,
			responses: [
				{
					id: 659,
					content: 'Your question is bad',
					score: 1
				},
				{
					id: 660,
					content: 'Your question is good',
					score: 2
				}
			]
		},

		{
			id: 457,
			content: 'and this is the second one',
			score: 5,
			responses: [
				{
					id: 661,
					content: 'Your question is bad',
					score: 3
				}
			]
		}
	]

};

ReactDOM.render(
	<WWProblem problem_data={problem_data} />,
	document.getElementById( 'webwork-app' )
);
