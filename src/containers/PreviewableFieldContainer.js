import { connect } from 'react-redux'
import PreviewableField from '../components/PreviewableField'
import { setCollapsed, setTextareaValue } from '../actions/app'

const mapStateToProps = ( state, ownProps ) => {
	const { collapsed, formData } = state
	const { fieldName } = ownProps

	const value = formData.hasOwnProperty( fieldName ) ? formData[ fieldName ] : ''
	const isPending = formData.isPending
	const isPreviewVisible = ! collapsed.hasOwnProperty( 'questionFormField_' + fieldName )

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

		onTextareaChange: ( event ) => {
			dispatch( setTextareaValue( ownProps.fieldName, event.target.value ) )
		}
	}
}

const PreviewableFieldContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PreviewableField)

export default PreviewableFieldContainer
