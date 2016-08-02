import React, { Component } from 'react'
import SidebarFilter from './SidebarFilter'
import SidebarFilterContainer from '../containers/SidebarFilterContainer'

export default class Sidebar extends Component {
	render() {
		return (
			<div className="ww-sidebar">
				<h3>Explore Questions</h3>

				<div className="ww-sidebar-widget">
					<ul className="ww-question-filters">
						<div className="ww-filter-section">
							<SidebarFilterContainer
							  name="Course"
							  type="dropdown"
							  slug="course"
							/>
							<SidebarFilterContainer
							  name="Section/Faculty"
							  type="dropdown"
							  slug="section"
							/>
						</div>

						<div className="ww-filter-section">
							<SidebarFilterContainer
							  name="Problem Set"
							  type="dropdown"
							  slug="problemSet"
							/>
						</div>

						<div className="ww-filter-section">
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
						</div>
					</ul>
				</div>
			</div>
		)
	}
}
