import React, { Component } from 'react'
import SidebarFilter from './SidebarFilter'
import SidebarFilterContainer from '../containers/SidebarFilterContainer'

export default class Sidebar extends Component {
	render() {
		return (
			<div className="ww-sidebar">
				<h3>Explore</h3>

				<div className="ww-sidebar-widget">
					<h4>Filter</h4>

					<ul className="ww-question-filters">
						<SidebarFilterContainer name="Course" />
						<SidebarFilterContainer name="Section/Faculty" />
						<SidebarFilterContainer name="Problem Set" />
						<SidebarFilterContainer name="Problem" />
						<SidebarFilterContainer 
						  name="Answered Questions" 
						  contrary="unansweredQuestions"
						  slug="answeredQuestions"
						  type="toggle"
						/>
						<SidebarFilterContainer 
						  name="Unanswered Questions" 
						  contrary="answeredQuestions"
						  slug="unansweredQuestions"
						  type="toggle"
						/>
					</ul>
				</div>
			</div>
		)
	}
}
