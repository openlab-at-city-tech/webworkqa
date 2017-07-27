import React, { Component } from 'react'

export default class SubscriptionDialog extends Component {
	render() {
		const { isSubscribed, onClick } = this.props

		let iconClass = 'hover-notice-parent subscription-dialog '
		let screenReaderText = ''
		if ( isSubscribed ) {
			iconClass += 'subscribed'
			screenReaderText = 'End email notifications.'
		} else {
			iconClass += 'unsubscribed'
			screenReaderText = 'Get email notifications.'
		}

		return (
			<button className={iconClass} onClick={onClick}>
				<span className="screen-reader-text">{ screenReaderText }</span>
				<i className="fa"></i>
				<div aria-hidden="true" className="hover-notice subscription-notice">
					{screenReaderText}
				</div>
			</button>
		)
	}
}
