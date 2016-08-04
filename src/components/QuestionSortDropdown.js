import React, { Component } from 'react'

export default class QuestionSortDropdown extends Component {
	render() {
		const { orderby, onSortChange } = this.props

		return (
			<div className='question-sort'>
				<select	
				  name='question-sort'
				  value={orderby}
				  onChange={onSortChange}
				>
					<option value='post_date'>Most Recent</option>
					<option value='response_count'>Most Responses</option>
					<option value='votes'>Most Votes</option>
				</select>
			</div>
		)
	}
}
