import { connect } from 'react-redux'
import ProblemListItem from '../components/ProblemListItem'

const mapStateToProps = ( state, ownProps ) => {
	const { problems } = state
	const { problemId } = ownProps

	const problem = problems[ problemId ]

	return {
		problem
	}
}

const ProblemListItemContainer = connect(
	mapStateToProps
)(ProblemListItem)

export default ProblemListItemContainer
