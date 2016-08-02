import React, { Component } from 'react'

export default class SidebarFilter extends Component {
	render() {
		const {
			contrary, slug, name, type, value,
			onFilterHeaderClick
		} = this.props

		const linkClassName = this.getClassName()

		return (
			<li>
				<a
				  onClick={onFilterHeaderClick}
				  className={linkClassName}
				  href="#"
				>
				  {name}
				</a>
			</li>
		)
	}

	getClassName() {
		const { type, value } = this.props

		let classNames = []

		switch ( type ) {
			case 'toggle' :
				if ( value ) {
					classNames.push( 'toggle-enabled' )
				}
			break;

			default: break;
		}

		return classNames.join( ' ' )
	}
}
