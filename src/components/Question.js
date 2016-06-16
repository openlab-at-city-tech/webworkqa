import React, { Component } from 'react';
import ScoreDialogContainer from '../containers/ScoreDialogContainer';
import ResponseList from './ResponseList';

export default class Question extends Component {
	render() {
		const { collapsed, onAccordionClick, itemId } = this.props
		const { title, content } = this.props.question
		const responses = []

		const isCollapsed = collapsed.hasOwnProperty( itemId );

		var styles = {
			li: {
				overflow: 'hidden',
				marginBottom: '15px'
			},
			wwQuestionContent: {
				paddingLeft: '50px'
			}
		};

		return (
			<li style={styles.li} className={isCollapsed ? 'question-closed' : 'question-open'}>
				<ScoreDialogContainer itemId={itemId} />

				<div className="ww-question-content" style={styles.wwQuestionContent}>
					{content}

					<ResponseList responses={responses} />
				</div>

				<a
					href="#"
					data-item-id={itemId}
					onClick={ e => { onAccordionClick( e.target.dataset.itemId ) } }
				>
					{isCollapsed ? 'Expand' : 'Collapse'}
				</a>
			</li>
		);
	}
}
