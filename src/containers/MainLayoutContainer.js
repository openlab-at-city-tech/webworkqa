import { connect } from 'react-redux'
import MainLayout from '../components/MainLayout'

const mapStateToProps = ( state ) => {
	const { appIsLoading } = state
	
	return {
		appIsLoading
	}
}

const MainLayoutContainer = connect(
	mapStateToProps
)(MainLayout)

export default MainLayoutContainer
