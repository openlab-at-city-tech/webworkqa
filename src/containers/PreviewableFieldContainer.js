import { connect } from 'react-redux'
import PreviewableField from '../components/PreviewableField'
import { changeQuestionText } from '../actions/questions'
import { setCollapsed } from '../actions/app'

const mapStateToProps = ( state, ownProps ) => {
	const { collapsed, questionFormData } = state

	const value = questionFormData.hasOwnProperty( ownProps.fieldName ) ? questionFormData[ ownProps.fieldName ] : ''
	const isPending = questionFormData.isPending
	const isPreviewVisible = ! collapsed.hasOwnProperty( 'questionFormField_' + ownProps.fieldName )

	return {
		isPending,
		isPreviewVisible,
		value
	}
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onPreviewToggleClick: () => {
			const collapsedKey = 'questionFormField_' + ownProps.fieldName
			dispatch( setCollapsed( collapsedKey ) )
		},

		onTextareaChange: ( value ) => {
			dispatch( changeQuestionText( ownProps.fieldName, value ) )
		}
	}
}

const PreviewableFieldContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PreviewableField)

export default PreviewableFieldContainer
