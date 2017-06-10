import { connect } from 'react-redux'
import App from '../components/App'

const mapStateToProps = (state, ownProps) => {
	const { appIsLoading, initialLoadComplete, routing } = state

	return {
		appIsLoading,
		initialLoadComplete,
		routing
	}
}

const AppContainer = connect(
	mapStateToProps
)(App)

export default AppContainer
