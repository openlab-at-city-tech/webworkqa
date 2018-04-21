import { connect } from 'react-redux'
import Uploader from '../components/Uploader'
import { addAttachment } from '../actions/app'

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
				multiple: true,
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

			// Get selected content when Attach is clicked, and process.
			frame.views.ready = function() {
				var toolbarView = frame.views.get('.media-frame-toolbar')[0]
				toolbarView.controller.on('select',function() {
					var selected = frame.state().get('selection')
					selected.map( function( attData ) {
						dispatch( addAttachment( ownProps.formId, attData ) )
					} )
				})
			}

			// Upload success callback.
			var uploaderView = frame.views.get('.media-frame-uploader')[0]
			uploaderView.on('ready', function() {
				uploaderView.uploader.success = function( attData ) {
					// get the attachment ID and add to the store
					// from the store, build attachment list
					dispatch( addAttachment( ownProps.formId, attData ) )
				}
			})

			frame.open()
		},
	}
}

const UploaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Uploader)

export default UploaderContainer
