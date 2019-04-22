import { combineReducers } from 'redux';
import airlines from './airlines';
import passengers from './passengers';
import contractApi from './contractApi';
import { loadingBarReducer } from 'react-redux-loading'

export default combineReducers({
    airlines,
    passengers,
    contractApi,
    loadingBar: loadingBarReducer,
})