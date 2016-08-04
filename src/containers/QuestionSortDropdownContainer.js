import { connect } from 'react-redux'
import QuestionSortDropdown from '../components/QuestionSortDropdown'
import { fetchQuestionIndexList } from '../actions/questions'
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
	const onSortChange = ( event ) => {
		const { value } = event.target

		dispatch( setSortOrderby( value ) )
		dispatch( fetchQuestionIndexList() )
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
