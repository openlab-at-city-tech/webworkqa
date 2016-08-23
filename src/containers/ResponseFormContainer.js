import { connect } from 'react-redux'
import ResponseForm from '../components/ResponseForm'
import { changeResponseText, sendResponse, setResponsePending } from '../actions/responses'
import { setCollapsed } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const { collapsed, responseFormData, responseFormPending } = state
	const { questionId } = ownProps

	const responseText = responseFormData.hasOwnProperty( questionId ) ? responseFormData[ questionId ] : ''
	const isPending = responseFormPending.hasOwnProperty( questionId ) && responseFormPending[ questionId ]

	const collapsedIndex = 'responseForm-' + ownProps.questionId
	const isCollapsed = collapsed.hasOwnProperty( collapsedIndex )

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
