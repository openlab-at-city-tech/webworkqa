import React, { Component } from 'react'
import QuestionIndexListContainer from '../containers/QuestionIndexListContainer'
import ResultsHeaderContainer from '../containers/ResultsHeaderContainer'
import SidebarContainer from '../containers/SidebarContainer'

export default class QuestionIndex extends Component {
	render() {
		// All the juggling here is because the Results page looks a bit different.
		const { isResultsPage } = this.props

		const headerElement = isResultsPage ? <ResultsHeaderContainer /> : ''

		let introElement = ''
		if ( isResultsPage ) {
			introElement = (
				<div className="index-intro">
					<p>Brief explanation of results?</p>
				</div>
			)
		} else {
			introElement = (
				<div className="index-intro">
					<h2>Introduction</h2>
					<p>Quaerat nemo debitis dolorum ratione est exercitationem aut molestias. Excepturi beatae et autem et quia quo rem. Et provident id ducimus. Quaerat temporibus doloribus rerum eaque et. Odio necessitatibus eos vitae molestiae in. Numquam et et molestias velit mollitia consequatur reiciendis. Iusto quo maxime quibusdam libero. Recusandae porro maiores laudantium mollitia rerum cumque voluptatem delectus. Sit quibusdam sint animi. Nemo qui qui expedita.</p>
				</div>
			)
		}

		let listHeaderElement = ''
		if ( ! isResultsPage ) {
			listHeaderElement = <h2>Recent Activity</h2>
		}

		return (
			<div>
				{headerElement}

				<div className="ww-main problem-index">
					{introElement}

					<div className="index-list">
						{listHeaderElement}
						<QuestionIndexListContainer />
					</div>
				</div>

				<SidebarContainer />
			</div>
		)
	}
}
