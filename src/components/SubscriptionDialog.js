import React, { Component } from 'react'

export default class SubscriptionDialog extends Component {
	render() {
		const { isSubscribed, onClick } = this.props

		let iconClass = 'subscription-dialog '
		let screenReaderText = ''
		if ( isSubscribed ) {
			iconClass += 'subscribed'
			screenReaderText = 'Click to unsubscribe'
		} else {
			iconClass += 'unsubscribed'
			screenReaderText = 'Click to subscribe'
		}

		return (
			<button className={iconClass} onClick={onClick}>
				<span className="screen-reader-text">{ screenReaderText }</span>
				<i className="fa"></i>
			</button>
		)
	}
}
