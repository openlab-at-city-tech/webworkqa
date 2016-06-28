import React, { Component } from 'react'

export default class MainLayout extends Component {
	render() {
		let elementClassName = 'ww-app';
		if ( this.props.appIsLoading ) {
			elementClassName += ' app-loading'
		}

		return (
			<div className={elementClassName}>
				<div className="app-loading-throbber">
					Loading...
				</div>

				<div className="ww-app-content">
					{this.props.children}
				</div>
			</div>
		)
	}
}
