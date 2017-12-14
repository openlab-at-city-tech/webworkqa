import React, { Component } from 'react'
import Select from 'react-select'

export default class QuestionSortDropdown extends Component {
	render() {
		const { orderby, onSortChange } = this.props

		const options = [
			{ value: 'post_date', label: 'Most Recent' },
			{ value: 'response_count', label: 'Most Replies' },
			{ value: 'votes', label: 'Most Votes' }
		]

		return (
			<div className='question-sort'>
				<label
					className='screen-reader-text'
				  htmlFor='question-sort'
				>Sort results by</label>

				<Select
				  autoBlur={true}
				  id='question-sort'
				  name='question-sort'
				  value={orderby}
				  onChange={onSortChange}
				  options={options}
				  clearable={false}
				/>
			</div>
		)
	}
}
