import React, { Component } from 'react'

export default class SidebarFilter extends Component {
	render() {
		const { name } = this.props

		return (
			<li>
				{name}
			</li>
		)
	}
}
