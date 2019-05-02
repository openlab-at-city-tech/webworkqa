import React, { Component } from 'react'

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

				<label htmlFor="anonymous-toggle-checkbox">Post this question anonymously. Only your professor will see your name.</label>
			</div>
		)
	}
}
