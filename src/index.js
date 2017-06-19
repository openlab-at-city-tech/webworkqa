import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import configureStore from './configureStore'
import Root from './components/Root'

const store = configureStore()

syncHistoryWithStore(
	createHistory({
		basename: '/wpmaster/foo1' /* @todo */
	}),
	store
)

render(
	<Root store={store} />,
	document.getElementById( 'webwork-app' )
)
