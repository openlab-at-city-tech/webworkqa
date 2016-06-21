import { connect } from 'react-redux'
import AnsweredDialog from '../components/AnsweredDialog'
import { clickAnswered } from '../actions'

const mapStateToProps = (state) => {
	const { answered } = state
	return {
		answered
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
