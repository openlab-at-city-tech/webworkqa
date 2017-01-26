import React, { Component } from 'react'
import SidebarFilter from './SidebarFilter'
import SidebarFilterContainer from '../containers/SidebarFilterContainer'

export default class Sidebar extends Component {
	render() {
		const helpURL = window.WWData.page_base + 'help/explore-existing-questions-and-replies/#Filters'

		return (
			<div className="ww-sidebar">
				<h3 className="ww-header">Explore Questions</h3>

				<div className="ww-sidebar-widget">
					<p>
						Use the <a href={helpURL} >filters</a> below to navigate the questions that have been posted. You can select questions by course, section,
						a specific WeBWorK problem set, and to select only answered or unanswered questions.
					</p>

					<ul className="ww-question-filters">
						<SidebarFilterContainer
						  name="Select Course"
						  type="dropdown"
						  slug="course"
						/>
						<SidebarFilterContainer
						  name="Select Section/Faculty"
						  type="dropdown"
						  slug="section"
						/>

						<SidebarFilterContainer
						  name="Select Problem Set"
						  type="dropdown"
						  slug="problemSet"
						/>

						<SidebarFilterContainer
						  name="Select Questions"
						  slug="answered"
						  type="dropdown"
						/>
					</ul>
				</div>
			</div>
		)
	}
}
