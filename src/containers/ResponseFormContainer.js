import { connect } from 'react-redux'
import ResponseForm from '../components/ResponseForm'
import { sendResponse, setResponsePending } from '../actions/responses'
import { setCollapsed } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const { collapsed, formData, responseFormPending } = state
	const { questionId } = ownProps

	const isPending = responseFormPending.hasOwnProperty( questionId ) && responseFormPending[ questionId ]

	const collapsedIndex = 'responseForm-' + ownProps.questionId
	const isCollapsed = collapsed.hasOwnProperty( collapsedIndex )
	const responseText = formData.hasOwnProperty( 'response-text-' + questionId ) ? formData[ 'response-text-' + questionId ] : ''

	return {
		isCollapsed,
		isPending,
		responseText
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onAccordionClick: () => {
			dispatch( setCollapsed( 'responseForm-' + ownProps.questionId ) )
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
