import { connect } from 'react-redux'
import QuestionSortDropdown from '../components/QuestionSortDropdown'
import { fetchQuestionIndexList } from '../actions/questions'
import { fetchProblem } from '../actions/problems'
import { setSortOrderby } from '../actions/app'

const mapStateToProps = ( state, ownProps ) => {
	const { currentFilters } = state

	let orderby
	if ( currentFilters ) {
		orderby = currentFilters.orderby
	}

	return {
		orderby
	}
}

const mapDispatchToProps = ( dispatch, ownProps ) => {
	const onSortChange = ( change ) => {
		const { value } = change
		const { itemType, problemId } = ownProps

		dispatch( setSortOrderby( value ) )

		// This suggests that the handler should belong to the QuestionContainer
		// and ProblemContainer. Passing this param feels icky.
		if ( 'problem' === itemType ) {
			dispatch( fetchProblem( problemId ) )
		} else {
			dispatch( fetchQuestionIndexList( false ) )
		}
	}

	return {
		onSortChange
	}
}

const QuestionSortDropdownContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(QuestionSortDropdown)

export default QuestionSortDropdownContainer
