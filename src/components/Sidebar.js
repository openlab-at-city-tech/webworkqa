import React, { Component } from 'react'
import SidebarFilter from './SidebarFilter'

export default class Sidebar extends Component {
	render() {
		return (
			<div className="ww-sidebar">
				<h3>Explore</h3>

				<div className="ww-sidebar-widget">
					<h4>Filter</h4>

					<ul className="ww-question-filters">
						<SidebarFilter name="Course" />
						<SidebarFilter name="Section/Faculty" />
						<SidebarFilter name="Problem Set" />
						<SidebarFilter name="Problem" />
						<SidebarFilter name="Answered Questions" />
						<SidebarFilter name="Unanswered Questions" />
					</ul>
				</div>
			</div>
		)
	}
}
