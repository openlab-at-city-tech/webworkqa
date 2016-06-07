import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'

render(
	<Root />,
	document.getElementById( 'webwork-app' )
)

/*
import ReactDOM from 'react-dom'

import Redux from 'redux'
import ReduxReact from 'react-redux'
import { Provider } from 'react-redux'


import WWProblem from './components/WWProblem'
import { fetchProblem } from './actions'

console.log( store.getState() );

store.dispatch( fetchProblem( '101010104019' ) ).then(() => console.log(store.getState()) )

ReactDOM.render(
	<WWProblem problem_data={problem_data} />,
	document.getElementById( 'webwork-app' )
);
// Now: WP endpoint has to be modified to return a proper Redux store for the problem.

var problem_data = {
	id: 1234,
	title: 'This is the title of my problem',
	summary: 'A bunch of math shit',
	questions: [
		{
			id: 456,
			content: 'THis is the first question',
			score: 4,
			responses: [
				{
					id: 659,
					content: 'Your question is bad',
					score: 1
				},
				{
					id: 660,
					content: 'Your question is good',
					score: 2
				}
			]
		},

		{
			id: 457,
			content: 'and this is the second one',
			score: 5,
			responses: [
				{
					id: 661,
					content: 'Your question is bad',
					score: 3
				}
			]
		}
	]

};
*/
