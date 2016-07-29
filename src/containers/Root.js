import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { If, Then, Else } from 'react-if'
import configureStore from '../configureStore'
import QuestionIndex from '../components/QuestionIndex'
import MainLayoutContainer from './MainLayoutContainer'
import ProblemContainer from './ProblemContainer'
import { setCurrentQuestion } from '../actions/app'

const store = configureStore()

export default class Root extends Component {
	componentWillMount() {
		const { locationArray } = this.props

		if ( 'problem' == locationArray[0] ) {
			const questionIdMatches = locationArray[ locationArray.length - 1 ].match( /^question-(\d+)/ )
			if ( questionIdMatches ) {
				store.dispatch( setCurrentQuestion( questionIdMatches[1] ) )
			}
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

		return (
			<Provider store={store}>
				<If condition={isSingleProblem}>
					<Then>
						<ProblemContainer problemId={problemId} />
					</Then>
					<Else>
						<QuestionIndex />
					</Else>
				</If>
			</Provider>
		)
	}
}
