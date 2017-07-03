import { connect } from 'react-redux'
import PreviewableField from '../components/PreviewableField'
import { setCollapsed, setTextareaValue } from '../actions/app'

const mapStateToProps = ( state, ownProps ) => {
	const { collapsed, formData } = state
	const { fieldId, fieldName } = ownProps

	const value = formData[ fieldId ][ fieldName ]
	const isPending = formData[ fieldId ].isPending 
	const isPreviewVisible = ! collapsed.hasOwnProperty( fieldId + '-' + fieldName )

	return {
		isPending,
		isPreviewVisible,
		value
	}
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		onPreviewToggleClick: () => {
			const collapsedKey = ownProps.fieldId + '-' + ownProps.fieldName
			dispatch( setCollapsed( collapsedKey ) )
		},

		onTextareaChange: ( event ) => {
			dispatch( setTextareaValue( ownProps.fieldId, ownProps.fieldName, event.target.value ) )
		}
	}
}

const PreviewableFieldContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(PreviewableField)

export default PreviewableFieldContainer
