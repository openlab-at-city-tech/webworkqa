import React, { Component } from 'react';
import { getString } from '../util/webwork-i18n'

export default class Problem extends Component {
	render() {
		return (
			<div>
				{getString('noProblemFound')}
			</div>
		)
	}
}
