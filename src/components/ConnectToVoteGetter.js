import React from 'react';

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

export default connectToVoteGetter;
