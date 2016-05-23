import React from 'react';
import ReactDOM from 'react-dom';

import Redux from 'redux';
import ReduxReact from 'react-redux';

//import 'bootstrap-webpack';
//import Widget from './components/widget';

// Query DOM for all widget wrapper divs
//let widgets = document.querySelectorAll( 'div.react-demo-wrapper' );
//widgets = Array.prototype.slice.call( widgets );

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
		var rows = [];
		this.props.questions.forEach(function(question) {
			rows.push( <WWQuestion key={question.id} question={question} /> );
		});
		return (
			<div className="ww-question-list">
				<ul>
					{rows}
				</ul>
			</div>
		);
	}
});

var WWQuestion = React.createClass({
	render: function() {
		return (
			<li>
				<div className="ww-question-content">
					{this.props.question.content}
				</div>

				<WWScoreDialog score={this.props.question.score} />

				<WWResponseList responses={this.props.question.responses} />
			</li>
		);
	}
});

var WWResponseList = React.createClass({
	render: function() {
		var rows = [];
		this.props.responses.forEach( function(response) {
			rows.push( <WWResponse key={response.id} response={response} /> );
		});

		return (
			<div className="ww-response-list">
				Responses
				<ul>
					{rows}
				</ul>
			</div>
		);
	}
});

var WWResponse = React.createClass({
	render: function() {
		return (
			<li>
				{this.props.response.content}
				<WWScoreDialog score={this.props.response.score} />
			</li>
		);
	}
});

var WWScoreDialog = React.createClass({
	getInitialState: function() {
		return {
			score: '0',
			myvote: ''
		}
	},

	render: function() {
		return (
			<div className="ww-score">
				<button disabled={this.state.myvote == 'down'} className="ww-score-up ww-score-vote" onClick={this.toggleUp}>Up</button> 
				 <span className="ww-score-value">{this.state.score}</span> 
				<button disabled={this.state.myvote == 'up'} className="ww-score-down ww-score-vote" onClick={this.toggleDown}>Down</button>
			</div>
		);
	},

	toggleUp: function() {
		if ( this.state.myvote === 'up' ) {
			this.modScore( -1 );
			this.setMyVote( '' );
		} else if ( this.state.myvote === '' ) {
			this.modScore( 1 );
			this.setMyVote( 'up' );
		}
	},

	toggleDown: function() {
		if ( this.state.myvote === 'down' ) {
			this.modScore( 1 );
			this.setMyVote( '' );
		} else if ( this.state.myvote === '' ) {
			this.modScore( -1 );
			this.setMyVote( 'down' );
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
