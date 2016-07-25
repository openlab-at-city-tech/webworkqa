import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { browserHistory, Router, Route, IndexRoute } from 'react-router'
import configureStore from '../configureStore'
import QuestionIndex from '../components/QuestionIndex'
import MainLayoutContainer from './MainLayoutContainer'
import ProblemContainer from './ProblemContainer'

const store = configureStore()

const foo = true

export default class Root extends Component {
	render() {
		const { route_base } = window.WWData

		return (
			<Provider store={store}>
				<Router history={browserHistory}>
					<Route path={route_base} component={MainLayoutContainer}>
						<IndexRoute component={QuestionIndex} />
						<Route path="problems/:problemId" component={ProblemContainer} />
					</Route>
				</Router>
			</Provider>
		)
	}
}
