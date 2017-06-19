import React, { Component } from 'react'
import Select from 'react-select'

export default class SidebarFilter extends Component {
	render() {
		const { slug } = this.props

		const contentContainerId = slug + '-content'
		const filterContent = this.getFilterContent()

		return (
			<li>
				<div
					id={contentContainerId}
					className="filter-content"
				>
					{filterContent}
				</div>
			</li>
		)
	}

	getHeaderClassName() {
		const { type, value } = this.props

		let classNames = []

		switch ( type ) {
			case 'toggle' :
			case 'dropdown' :
				if ( value ) {
					classNames.push( 'toggle-enabled' )
				}
				break

			default: break;
		}

		return classNames.join( ' ' )
	}

	getFilterContent() {
		const {
			name, slug, value, options,
			onFilterChange
		} = this.props

		let optionElements = []
		if ( 'undefined' === typeof ( options ) || ! options.length ) {
			return optionElements
		}

		let selectData = []

		let option = {}
		for ( var i = 0; i < options.length; i++ ) {
			option = options[ i ]
			selectData.push( {
				value: option.value,
				label: option.name
			} )
		}

		const filterName = 'filter-' + slug

		return (
			<Select
				autoBlur={true}
				name={filterName}
				value={value}
				onChange={onFilterChange}
				options={selectData}
				placeholder={name}
				clearable={false}
			/>
		)
	}
}
