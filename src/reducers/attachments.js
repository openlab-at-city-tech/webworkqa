import { ADD_ATTACHMENT, RECEIVE_ATTACHMENTS } from '../actions/app'

export function attachments( state = {}, action ) {
	switch ( action.type ) {
		case ADD_ATTACHMENT :
			const { attData } = action.payload

			let attDataForState = {
				id: attData.id,
				caption: attData.attributes.caption,
				filename: attData.attributes.filename,
				urlFull: attData.attributes.sizes.full.url,
				title: attData.attributes.title
			}

			if ( attData.attributes.sizes.hasOwnProperty( 'large' ) ) {
				attDataForState.urlLarge = attData.attributes.sizes.large.url
			}

			if ( attData.attributes.sizes.hasOwnProperty( 'medium' ) ) {
				attDataForState.urlMedium = attData.attributes.sizes.medium.url
			}

			let newState = Object.assign( {}, state )
			newState[ attData.id ] = attDataForState

			return newState

		case RECEIVE_ATTACHMENTS :
			return Object.assign( {}, state, action.payload )

		default :
			return state
	}
}

