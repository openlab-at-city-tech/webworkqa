import { connect } from 'react-redux'
import ScoreDialog from '../components/ScoreDialog'
import { clickVote } from '../actions/votes'

const mapStateToProps = (state) => {
	const { scores, viewType, votes } = state
	return {
		scores,
		userCanVote: 'problem' == viewType.viewType && window.WWData.user_can_vote,
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
