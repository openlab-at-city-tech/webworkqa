import { connect } from 'react-redux'
import AnsweredDialog from '../components/AnsweredDialog'
import { clickAnswered } from '../actions/responses'

const mapStateToProps = (state, ownProps) => {
	const { responses } = state
	const { responseId } = ownProps

	const isAnswered = responseId ? responses[ownProps.responseId].isAnswer : false
	return {
		isAnswered
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAnsweredClick: ( responseId, isAnswered ) => {
			dispatch( clickAnswered( responseId, isAnswered ) )
		}
	}
}

const AnsweredDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AnsweredDialog)

export default AnsweredDialogContainer
