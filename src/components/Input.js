import React, { Component } from 'react';

export default class Input extends Component {
	render() {
		const { type, value } = this.props

		return (
			<input
			  type={type}
			  disabled={true}
			  value={value}
			/>
		)
	}
}
