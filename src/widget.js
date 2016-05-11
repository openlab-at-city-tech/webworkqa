import React from 'react';
import ReactDOM from 'react-dom';

import Redux from 'redux';
import ReduxReact from 'react-redux';
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
			rows.push( <WWQuestion question={question} /> );
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

				<WWResponseList responses={this.props.question.responses} />
			</li>
		);
	}
});

var WWResponseList = React.createClass({
	render: function() {
		var rows = [];
		this.props.responses.forEach( function(response) {
			rows.push( <WWResponse response={response} /> );
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
			</li>
		);
	}
});

var problem_data = {
	id: 1234,
	title: 'This is the title of my problem',
	summary: 'A bunch of math shit',
	questions: [
		{
			content: 'THis is the first question',
			responses: [
				{ content: 'Your question is bad' },
				{ content: 'Your question is good' }
			]
		},

		{
			content: 'and this is the second one',
			responses: [
				{ content: 'Your question is bad' }
			]
		}
	]

};

ReactDOM.render(
	<WWProblem problem_data={problem_data} />,
	document.getElementById( 'webwork-app' )
);
