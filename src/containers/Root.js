import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import configureStore from '../configureStore'
import MainLayout from '../components/MainLayout'
import ProblemListContainer from './ProblemListContainer'
import ProblemContainer from './ProblemContainer'

const store = configureStore()

const foo = true

export default class Root extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router history={browserHistory}>
					<Route path="wpmaster/foo1/webwork/" component={MainLayout}>
						<IndexRoute component={ProblemListContainer} />
						<Route path="problems/:problemId" component={ProblemContainer} />
					</Route>
				</Router>
			</Provider>
		)
	}
}

// <AsyncApp problemId='101010104019' />
