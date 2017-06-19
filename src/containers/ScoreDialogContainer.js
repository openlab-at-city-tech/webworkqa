import { connect } from 'react-redux'
import ScoreDialog from '../components/ScoreDialog'
import { clickVote } from '../actions/votes'

const mapStateToProps = (state, ownProps) => {
	const { scores, viewType, votes } = state
	const { itemId } = ownProps

	const score = scores.hasOwnProperty( itemId ) ? scores[ itemId ] : 0
	const vote = votes.hasOwnProperty( itemId ) ? votes[ itemId ] : ''

	return {
		score,
		userCanVote: 'problem' === viewType.viewType && window.WWData.user_can_vote,
		vote
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onVoteClick: ( itemId, voteType ) => {
			dispatch( clickVote( itemId, voteType, ownProps.itemType ) )
		}
	}
}

const ScoreDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ScoreDialog)

export default ScoreDialogContainer
