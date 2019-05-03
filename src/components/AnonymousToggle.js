import React, { Component } from 'react'
import { getString } from '../util/webwork-i18n'

export default class AnonymousToggle extends Component {
	render() {
		const { onChange, isAnonymous } = this.props

		return (
			<div className="anonymous-toggle">
				<input
					checked={isAnonymous}
					id="anonymous-toggle-checkbox"
					onChange={onChange}
					type="checkbox"
					value="1"
				/>

				<label htmlFor="anonymous-toggle-checkbox">{getString('anonymousToggleLabel')}</label>
			</div>
		)
	}
}
