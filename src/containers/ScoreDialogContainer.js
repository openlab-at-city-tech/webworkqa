import { connect } from 'react-redux'
import ScoreDialog from '../components/ScoreDialog'
import { clickVote } from '../actions'

const mapStateToProps = (state) => {
	const { scores, votes } = state
	return {
		scores,
		userCanVote: window.WWData.user_can_vote,
		votes
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onVoteClick: ( itemId, voteType ) => {
			dispatch( clickVote( itemId, voteType ) )
		}
	}
}

const ScoreDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ScoreDialog)

export default ScoreDialogContainer
