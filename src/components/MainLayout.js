import React, { Component } from 'react'

export default class MainLayout extends Component {
	render() {
		return (
			<div className="ww-app">
				{this.props.children}
			</div>
		)
	}
}
