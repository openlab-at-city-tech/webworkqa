import React, { Component } from 'react'
import QuestionIndexListContainer from '../containers/QuestionIndexListContainer'
import QuestionSortDropdownContainer from '../containers/QuestionSortDropdownContainer'
import ResultsHeaderContainer from '../containers/ResultsHeaderContainer'
import SidebarContainer from '../containers/SidebarContainer'

export default class QuestionIndex extends Component {
	render() {
		// All the juggling here is because the Results page looks a bit different.
		const { isResultsPage } = this.props

		const headerElement = isResultsPage ? <ResultsHeaderContainer /> : ''

		let introElement = ''
		if ( ! isResultsPage ) {
			introElement = (
				<div className="index-intro">
					<p>Quaerat nemo debitis dolorum ratione est exercitationem aut molestias. Excepturi beatae et autem et quia quo rem. Et provident id ducimus. Quaerat temporibus doloribus rerum eaque et. Odio necessitatibus eos vitae molestiae in. Numquam et et molestias velit mollitia consequatur reiciendis.</p>
				</div>
			)
		}

		let listHeaderElement = ''
		if ( ! isResultsPage ) {
			listHeaderElement = <h2 className="ww-header">Recent Activity</h2>
		}

		let dropdownElement = ''
		if ( isResultsPage ) {
			dropdownElement = <QuestionSortDropdownContainer />
		}

		return (
			<div>
				{headerElement}

				<div className="problem-index">
					{introElement}

					<div className="index-list">
						{listHeaderElement}

						{dropdownElement}
						<QuestionIndexListContainer />
					</div>
				</div>
			</div>
		)
	}
}
