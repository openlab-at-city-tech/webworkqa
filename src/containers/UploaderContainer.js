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
 * - The WP uploader sends items to the *current* site, but WW config allows the site to be a different one in the network (and this is how my default environment and openlabdev are configured, though not the production site). Either (a) disable and untangle this feature, (b) find a way to make the WP uploader point to the webwork_server_site_id(), or (c) move the items to the correct place after upload.
 * - Render `attachments` from store on front end during edit/display
 * - During edit/create, send attachment IDs along with other formData. After submitting, switch post parent.
 * - Send attachment IDs along with question
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
				//	dispatch( addAttachment( ownProps.formId, attData ) )
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
