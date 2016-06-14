import React from 'react';

/**
 * Higher order component implementing the vote getting functionality.
 *
 * Add to component Foo:
 *     Foo = connectToVoteGetter( Foo );
 */
var connectToVoteGetter = function( Component ) {
	const VoteGetter = React.createClass({

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
			const { itemId, handleToggleVote } = this.props
			return <Component 
				handleToggleVote={handleToggleVote}
				itemId={itemId}
				{...this.props}
				/>
		}
	});

	return VoteGetter;
};

export default connectToVoteGetter;
