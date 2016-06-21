import React from 'react';
import Response from './Response.js';

var ResponseList = React.createClass({
	render: function() {
		const { isMyQuestion, responseIds, responses } = this.props

		var styles = {
			ul: {
				listStyleType: 'none'
			}
		};

		var rows = [];
		var response
		this.props.responseIds.forEach( function(responseId) {
			response = responses.hasOwnProperty( responseId ) ? responses[ responseId ] : false;
			if ( response ) {
				rows.push( <Response
						key={responseId}
						isMyQuestion={isMyQuestion}
						responseId={responseId}
						response={response}
						/> );
			}
		});

		return (
			<div className="ww-response-list">
				<ul style={styles.ul}>
					{rows}
				</ul>
			</div>
		);
	}
});

export default ResponseList;
