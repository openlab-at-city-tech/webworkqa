import React, { Component } from 'react'
import ProblemListContainer from '../containers/ProblemListContainer'

export default class ProblemIndex extends Component {
	render() {
		return (
			<div className="problem-index">
				<div className="index-intro">
					<h2>Introduction</h2>
					<p>Quaerat nemo debitis dolorum ratione est exercitationem aut molestias. Excepturi beatae et autem et quia quo rem. Et provident id ducimus. Quaerat temporibus doloribus rerum eaque et. Odio necessitatibus eos vitae molestiae in. Numquam et et molestias velit mollitia consequatur reiciendis. Iusto quo maxime quibusdam libero. Recusandae porro maiores laudantium mollitia rerum cumque voluptatem delectus. Sit quibusdam sint animi. Nemo qui qui expedita.</p>
				</div>

				<div className="index-list">
					<h2>Recent Problems on OpenLab WeBWorK</h2>
					<ProblemListContainer />
				</div>
			</div>
		)
	}
}
