import { connect } from 'react-redux'
import SubscriptionDialog from '../components/SubscriptionDialog'
import { toggleSubscription } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const { itemId } = ownProps
	const { subscriptions } = state

	return {
		isSubscribed: subscriptions.hasOwnProperty( itemId )
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { itemId } = ownProps

	return {
		onClick: () => {
			dispatch( toggleSubscription( itemId ) )
		}
	}
}

const SubscriptionDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SubscriptionDialog)

export default SubscriptionDialogContainer
