import React, { Component } from 'react';

export default class Input extends Component {
	render() {
		const { type, value } = this.props

		return (
			<span>
				<input
				  type={type}
				  disabled={true}
				  value={value}
				  className="ww-disabled-input"
				/>
				<br />
			</span>
		)
	}
}
