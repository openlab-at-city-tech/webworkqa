import { connect } from 'react-redux'
import ResponseForm from '../components/ResponseForm'
import { changeResponseText, sendResponse, setResponsePending } from '../actions/responses'

const mapStateToProps = (state, ownProps) => {
	const { responseFormData, responseFormPending } = state
	const { questionId } = ownProps

	const responseText = responseFormData.hasOwnProperty( questionId ) ? responseFormData[ questionId ] : ''
	const isPending = responseFormPending.hasOwnProperty( questionId ) && responseFormPending[ questionId ]

	return {
		responseText,
		isPending
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onTextareaChange: ( e ) => {
			dispatch( changeResponseText( ownProps.questionId, e.target.value ) )
		},

		onResponseFormSubmit: ( e, responseText ) => {
			e.preventDefault()
			dispatch( setResponsePending( ownProps.questionId, true ) )
			dispatch( sendResponse( ownProps.questionId, responseText ) )
		}
	}
}

const ResponseFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ResponseForm)

export default ResponseFormContainer
