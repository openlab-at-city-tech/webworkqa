import React from 'react'
import { connect } from 'react-redux'
import { toggleVote } from '../actions'

const VoteGetter = React.createClass({
	componentWillMount() {

	}
});

function mapStateToProps( state ) {
	return {
		
	}
}

export default connect( mapStateToProps )( VoteGetter )
