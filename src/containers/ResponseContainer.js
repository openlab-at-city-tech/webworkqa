import { connect } from 'react-redux'
import Response from '../components/Response'

const mapStateToProps = (state, ownProps) => {
	const { responses } = state
	const { responseId } = ownProps

	const response = responses.hasOwnProperty( responseId ) ? responses[ responseId ] : null

	return {
		response,
		userCanPostResponse: window.WWData.user_can_post_response > 0
	}
}

const ResponseContainer = connect(
	mapStateToProps
)(Response)

export default ResponseContainer
