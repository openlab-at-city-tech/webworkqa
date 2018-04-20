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

/*
 * @todo
 * - For new items, generate dummy item on server. Pass back dummy ID, and ensure it's sent when generating item. Then, copy over the attachments.
 * - For existing items, use the existing question/reply ID.
 * - Insert images?
 */

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

			// Rename tabs.
			frame.on( 'router:render:browse', function( routerView ) {
				routerView.set({
					upload: {
						text: 'Upload Files',
						priority: 20
					},
					browse: {
						text: 'My Uploaded Files',
						priority: 40
					}
				});
			}, frame )

			// Upload success callback.
			var uploaderView = frame.views.get('.media-frame-uploader')[0]
			uploaderView.on('ready', function() {
				uploaderView.uploader.success = function( foo ) {
					// get the attachment ID and add to the store
					// from the store, build attachment list
					console.log( foo )
				}
			})

			frame.open()
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
