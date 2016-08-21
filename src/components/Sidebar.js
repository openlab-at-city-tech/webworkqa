import React, { Component } from 'react'
import SidebarFilter from './SidebarFilter'
import SidebarFilterContainer from '../containers/SidebarFilterContainer'

export default class Sidebar extends Component {
	render() {
		return (
			<div className="ww-sidebar">
				<h3 className="ww-header">Explore Questions</h3>

				<div className="ww-sidebar-widget">
					<p>Voluptatibus eos ipsa consequatur. Dolorem vel amet veritatis totam quia ducimus. Sed praesentium sit illum quasi.</p>

					<ul className="ww-question-filters">
						<div className="ww-filter-section">
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
						</div>

						<div className="ww-filter-section">
							<SidebarFilterContainer
							  name="Select Problem Set"
							  type="dropdown"
							  slug="problemSet"
							/>
						</div>

						<div className="ww-filter-section">
							<SidebarFilterContainer
							  name="Select Questions"
							  slug="answered"
							  type="dropdown"
							/>
						</div>
					</ul>
				</div>
			</div>
		)
	}
}
