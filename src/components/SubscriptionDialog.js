import React, { Component } from 'react'
import { __ } from '@wordpress/i18n';

export default class SubscriptionDialog extends Component {
	render() {
		const { isSubscribed, onClick } = this.props

		let iconClass = 'hover-notice-parent subscription-dialog '
		let screenReaderText = ''
		let linkText
		if ( isSubscribed ) {
			iconClass += 'subscribed'
			screenReaderText = __( 'End email notifications.', 'webwork' )
		} else {
			iconClass += 'unsubscribed'
			screenReaderText = __( 'Notify me of future replies to this question.', 'webwork' )
		}

		return (
			<button
				aria-label={screenReaderText}
				className={iconClass}
				onClick={onClick}
			>
				<span className="screen-reader-text">{ screenReaderText }</span>
				<i className="fa"></i>
				<div aria-hidden="true" className="hover-notice subscription-notice">
					{screenReaderText}
				</div>
			</button>
		)
	}
}
