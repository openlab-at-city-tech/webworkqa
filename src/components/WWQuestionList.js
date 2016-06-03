import React from 'react';
import WWQuestion from './WWQuestion';

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

export default WWQuestionList;
