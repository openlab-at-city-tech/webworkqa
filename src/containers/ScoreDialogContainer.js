import { connect } from 'react-redux'
import ScoreDialog from '../components/ScoreDialog'
import { clickVote } from '../actions/votes'

const mapStateToProps = (state) => {
	const { scores, votes } = state
	return {
		scores,
		userCanVote: window.WWData.user_can_vote,
		votes
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
