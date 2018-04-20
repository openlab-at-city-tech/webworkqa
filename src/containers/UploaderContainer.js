import { connect } from 'react-redux'
import Uploader from '../components/Uploader'

const mapStateToProps = (state, ownProps) => {
	const { collapsed, formData, questionsById } = state
	return {}
	/*
	return {
		content,
		isCollapsed,
		isPending,
		problemHasQuestions,
		problemText,
		tried
	}
	*/
}

const mapDispatchToProps = (dispatch, ownProps) => {
	let frame
	return {
		onUploadClick: () => {
			if ( frame ) {
				frame.open()
				return
			}
			frame = wp.media({
				title: 'Attach Files',
				button: {
					text: 'Attach'
				},
				multiple: true
			});

			frame.on( 'router:render:browse', function( routerView ) {
				routerView.set({
					upload: {
						text:     'Upload Files',
						priority: 20
					},
					browse: {
						text:     'My Uploaded Files',
						priority: 40
					}
				});
			}, frame )

			frame.open()
			console.log('congrats')
		},

		onAccordionClick: () => {
			dispatch( setCollapsed( 'questionForm' ) )
		},

		onQuestionFormSubmit: ( e, content, tried, problemText ) => {
			e.preventDefault()
			dispatch( setQuestionPending( true ) )
			dispatch( sendQuestion( ownProps.problemId, content, tried, problemText ) )
		}
	}
}

const UploaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Uploader)

export default UploaderContainer
