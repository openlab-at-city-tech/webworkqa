import React, { Component } from 'react'
import QuestionIndexListContainer from '../containers/QuestionIndexListContainer'
import QuestionSortDropdownContainer from '../containers/QuestionSortDropdownContainer'
import ResultsHeaderContainer from '../containers/ResultsHeaderContainer'
import SidebarContainer from '../containers/SidebarContainer'

export default class QuestionIndex extends Component {
	componentDidMount() {
		// This is so amazing it makes me want to wrap up my programming career
		setTimeout( function() {
			if ( ! document.hasOwnProperty( 'webwork_initialized' ) || ! document.webwork_initialized ) {
				document.webwork_scaffold_init()
				document.webwork_initialized = true
			}
		}, 1000 );
	}

	componentWillUnmount() {
		document.webwork_initialized = false
	}

	render() {
		// All the juggling here is because the Results page looks a bit different.
		const { isLoading, isResultsPage } = this.props

		const headerElement = isResultsPage ? <ResultsHeaderContainer /> : ''

		const aboutURL = window.WWData.page_base + 'about'

		let introElement = ''
		if ( ! isResultsPage ) {
			introElement = (
				<div className="index-intro">
					<p>You are viewing <a href={aboutURL}>WeBWorK on the OpenLab</a>. Here, you can ask questions and discuss WeBWorK homework problems, and also see what other students have been asking.</p>
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

		let loadingElement = ''
		if ( isLoading ) {
			loadingElement = (
				<div className="question-list-loading-more">
					Loading more...
				</div>
			)
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

					{loadingElement}
				</div>
			</div>
		)
	}
}
