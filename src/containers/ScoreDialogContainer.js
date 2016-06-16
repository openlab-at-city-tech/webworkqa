import { connect } from 'react-redux'
import ScoreDialog from '../components/ScoreDialog'
import { clickVote } from '../actions'

const mapStateToProps = (state) => {
	const { scores, votes } = state
	return {
		scores,
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
