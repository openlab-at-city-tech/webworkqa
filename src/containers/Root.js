import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import MainLayoutContainer from './MainLayoutContainer'
import ProblemContainer from './ProblemContainer'
import QuestionIndexContainer from './QuestionIndexContainer'
import { setViewType } from '../actions/app'

const store = configureStore()

export default class Root extends Component {
	componentWillMount() {
		const { locationArray } = this.props

		if ( 'problem' == locationArray[0] ) {
			const questionIdMatches = locationArray[ locationArray.length - 1 ].match( /^question-(\d+)/ )
			if ( questionIdMatches ) {
				store.dispatch( setViewType( 'problem', questionIdMatches[1] ) )
			}
		}
	}

	componentWillReceiveProps() {
		const { locationArray } = this.props

		if ( 'results' == locationArray[0] ) {
			store.dispatch( setViewType( 'results' ) )
		}
	}

	render() {
		const { route_base } = window.WWData
		const { locationArray } = this.props

		let isSingleProblem = false
		let problemId = null
		if ( 'problem' == locationArray[0] ) {
			isSingleProblem = true
			locationArray.splice( 0, 1 )

			const questionIdMatches = locationArray[ locationArray.length - 1 ].match( /^question-(\d+)/ )
			if ( questionIdMatches ) {
				locationArray.splice( -1, 1 )
			}

			problemId = locationArray.join( '/' )
		}

		let rootElement = null
		if ( isSingleProblem ) {
			rootElement = <ProblemContainer problemId={problemId} />
		} else {
			rootElement = <QuestionIndexContainer />
		}

		return (
			<Provider store={store}>
				{rootElement}
			</Provider>
		)
	}
}
