import { getInitialData } from '../utils/api';
import { receiveAirlines } from '../actions/airlines';
import { receivePassengers } from '../actions/passengers';
import { receiveContractApi } from '../actions/contractApi';
import { showLoading, hideLoading } from 'react-redux-loading'

export function handleInitialData(contractApi, airlineAdresses, passengerAdresses) {


    return (dispatch) => {
        dispatch(showLoading())
        return getInitialData(airlineAdresses, passengerAdresses)
            .then(({ airlines, passengers }) => {
                dispatch(receiveAirlines(airlines));
                dispatch(receivePassengers(passengers));
                dispatch(receiveContractApi(contractApi));
                dispatch(hideLoading())
            })
    }
}

