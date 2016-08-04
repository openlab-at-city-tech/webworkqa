import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import configureStore from '../configureStore'
import ProblemContainer from './ProblemContainer'
import QuestionIndexContainer from './QuestionIndexContainer'
import { setViewType } from '../actions/app'

const store = configureStore()

class RootComponent extends Component {
	render() {
		const { route_base } = window.WWData
		const { appIsLoading, locationArray } = this.props

		let isSingleProblem = false
		let problemId = null

		// Create a clone to prevent direct modification of props.
		let _l = locationArray.slice(0)
		if ( 'problem' == _l[0] ) {
			isSingleProblem = true
			_l.splice( 0, 1 )

			const questionIdMatches = _l[ _l.length - 1 ].match( /^question-(\d+)/ )
			if ( questionIdMatches ) {
				_l.splice( -1, 1 )
			}

			problemId = _l.join( '/' )
		}

		let rootElement = null
		if ( isSingleProblem ) {
			rootElement = <ProblemContainer problemId={problemId} />
		} else {
			rootElement = <QuestionIndexContainer />
		}

		const wrapperClassName = appIsLoading ? 'app-loading' : ''

		return (
			<div className={wrapperClassName}>
				<div className="app-loading-throbber">
					Loading...
				</div>

				<div className="app-content">
					{rootElement}
				</div>
			</div>
		)
	}
}

function mapStateToProps( state, ownProps ) {
	const { appIsLoading } = state
	return { appIsLoading }
}

const InnerRoot = connect(
	mapStateToProps
)(RootComponent)

export default class Root extends Component {
	componentWillMount() {
		const { locationArray } = this.props

		if ( 'problem' == locationArray[0] ) {
			const questionIdMatches = locationArray[ locationArray.length - 1 ].match( /^question-(\d+)/ )
			if ( questionIdMatches ) {
				store.dispatch( setViewType( 'problem', questionIdMatches[1] ) )
			} else {
				store.dispatch( setViewType( 'problem' ) )
			}
		}
	}

	componentWillReceiveProps() {
		// No clue why locationArray can't be passed via props when navigating between pages.
		const locationArray = window.location.hash.replace(/^#\/?|\/$/g, '').split('/')
		console.log( locationArray )

		if ( 'results' == locationArray[0] ) {
			store.dispatch( setViewType( 'results' ) )
		}

		if ( 'problem' == locationArray[0] ) {
			const questionIdMatches = locationArray[ locationArray.length - 1 ].match( /^question-(\d+)/ )
			if ( questionIdMatches ) {
				store.dispatch( setViewType( 'problem', questionIdMatches[1] ) )
			} else {
				store.dispatch( setViewType( 'problem' ) )
			}
		}
	}

	render() {
		const { locationArray } = this.props

		return (
			<Provider store={store}>
				<InnerRoot locationArray={locationArray} />
			</Provider>
		)
	}
}
