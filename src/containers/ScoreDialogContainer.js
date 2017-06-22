import { connect } from 'react-redux'
import ScoreDialog from '../components/ScoreDialog'
import { clickVote } from '../actions/votes'
import { getCurrentView } from '../util/webwork-url-parser'

const mapStateToProps = (state, ownProps) => {
	const { scores, routing, votes } = state
	const { itemId } = ownProps

	const currentView = getCurrentView( routing )

	const score = scores.hasOwnProperty( itemId ) ? scores[ itemId ] : 0
	const vote = votes.hasOwnProperty( itemId ) ? votes[ itemId ] : ''

	return {
		isSingleProblem: currentView.hasOwnProperty( 'problemId' ),
		score,
		userCanVote: window.WWData.user_can_vote,
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
