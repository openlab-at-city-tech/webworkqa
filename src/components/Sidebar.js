import React, { Component } from 'react'
import SidebarFilterContainer from '../containers/SidebarFilterContainer'

export default class Sidebar extends Component {
	introText() {
		const { sidebarIntroText } = window.WWData

		{/* translators: link to home page */}
		return {
			__html: sidebarIntroText
		}
	}

	render() {
		return (
			<div className="ww-sidebar">
				<h3 className="ww-header">Explore Questions</h3>

				<div className="ww-sidebar-widget">
					<p dangerouslySetInnerHTML={this.introText()} />

					<ul className="ww-question-filters">
						<SidebarFilterContainer
							name={ __( 'Select Course', 'webwork' ) }
							type="dropdown"
							slug="course"
						/>
						<SidebarFilterContainer
							name={ __( 'Select Section/Faculty', 'webwork' ) }
							type="dropdown"
							slug="section"
						/>

						<SidebarFilterContainer
							name={ __( 'Select Problem Set', 'webwork' ) }
							type="dropdown"
							slug="problemSet"
						/>
					</ul>
				</div>
			</div>
		)
	}
}
