import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { Route, RouteHandler } from 'react-router' 
import { syncHistoryWithStore } from 'react-router-redux'
import { createHistory } from 'history'
import ProblemContainer from './ProblemContainer'
import SidebarContainer from './SidebarContainer'
import QuestionIndexContainer from './QuestionIndexContainer'
import { resetCurrentFilters, setViewType } from '../actions/app'

syncHistoryWithStore(
	createHistory(),
	store
)

class RootComponent extends Component {
	render() {
		const { route_base } = window.WWData
		const { appIsLoading, initialLoadComplete, locationArray } = this.props

		let isSingleProblem = false
		let problemId = null

		// Create a clone to prevent direct modification of props.
		let _l = locationArray.slice(0)
		if ( 'problem' == _l[0] && _l.length > 1 ) {
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

		const wrapperClassName = appIsLoading && ! initialLoadComplete ? 'app-loading' : ''

		return (
			<div className={wrapperClassName}>
				<div className="app-loading-throbber">
					Loading...
				</div>

				<div className="app-content">
					<div className="ww-main">
						{rootElement}
					</div>

					<SidebarContainer />
				</div>
			</div>
		)
	}
}

function mapStateToProps( state, ownProps ) {
	const { appIsLoading, initialLoadComplete } = state
	return {
		appIsLoading,
		initialLoadComplete
	}
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
		} else {
			store.dispatch( setViewType( '' ) )
		}
	}

	componentWillReceiveProps() {
		// No clue why locationArray can't be passed via props when navigating between pages.
		const locationArray = window.location.hash.replace(/^#\/?|\/$/g, '').split('/')

		let vtType = ''
		let vtObject = null
		if ( 'results' == locationArray[0] ) {
			vtType = 'results'
		}

		if ( 'problem' == locationArray[0] ) {
			const questionIdMatches = locationArray[ locationArray.length - 1 ].match( /^question-(\d+)/ )

			store.dispatch( resetCurrentFilters() )

			vtType = 'problem'
			if ( questionIdMatches ) {
				vtObject = questionIdMatches[1]
			}
		}

		store.dispatch( setViewType( vtType, vtObject ) )
	}

	render() {
		const { locationArray } = this.props

		return (
			<Provider store={store}>
				<InnerRoot locationArray={locationArray} />

				<RouteHandler />
			</Provider>
		)
	}
}

let routes = (
	<Route name="app" path="/" handler="Root">
		
	</Route>
);

Router.run( routes, function( Handler ) {
	React.render( <Handler />, document.getElementById( 'webwork-app' ) )
} );
