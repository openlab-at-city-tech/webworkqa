import React from 'react';
import Response from './Response.js';

var ResponseList = React.createClass({
	render: function() {
		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};

		var rows = [];
		this.props.responses.forEach( function(response) {
			rows.push( <Response key={response.id} response={response} /> );
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

export default ResponseList;
