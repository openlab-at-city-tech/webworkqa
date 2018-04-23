import { connect } from 'react-redux'
import Attachment from '../components/Attachment'

const mapStateToProps = ( state, ownProps ) => {
	const { attachments } = state
	const { attId } = ownProps

	console.log( attId )

	return {}
}

const AttachmentContainer = connect(
	mapStateToProps
)(Attachment)

export default AttachmentContainer
