import { connect } from 'react-redux'
import { setCollapsed, toggleEditing } from '../actions/app'
import { deleteResponse } from '../actions/responses'
import Response from '../components/Response'

const mapStateToProps = (state, ownProps) => {
	const { editing, responses } = state
	const { responseId } = ownProps

	const response = responses.hasOwnProperty( responseId ) ? responses[ responseId ] : null

	const isEditing = editing.hasOwnProperty( responseId )

	let userCanEdit = false
	if ( null !== response ) {
		userCanEdit = window.WWData.user_is_admin || response.authorId == window.WWData.user_id
	}

	return {
		isEditing,
		response,
		userCanEdit,
		userCanPostResponse: window.WWData.user_can_post_response > 0
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	const { responseId } = ownProps

	return {
		onDeleteClick: () => {
			dispatch( deleteResponse( responseId ) )
		},

		onEditClick: () => {
			dispatch( toggleEditing( responseId ) )
			dispatch( setCollapsed( 'response-' + responseId + '-content', true ) )
		}
	}
}

const ResponseContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Response)

export default ResponseContainer
