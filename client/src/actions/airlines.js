import { storeAirline, storeFlight } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'

export const ADD_AIRLINE = 'ADD_AIRLINE';
export const ADD_FLIGHT = 'ADD_FLIGHT';
export const RECEIVE_AIRLINES = 'RECEIVE_AIRLINES';


export function receiveAirlines(airlines) {
    return {
        type: RECEIVE_AIRLINES,
        airlines,
    }
}


function addAirline(airline) {
    return {
        type: ADD_AIRLINE,
        airline,
    }
}

function addFlight(id, flightNumber, flight) {
    return {
        type: ADD_FLIGHT,
        id,
        flightNumber,
        flight,
    }
}

export function handleAddAirline(id, name, country, address) {
    return (dispatch) => {

        dispatch(showLoading())

        return storeAirline({ id, name, country, address })
            .then((airline) => { dispatch(addAirline(airline)) })
            .then(() => dispatch(hideLoading()))
    }
}

export function handleUpdateAirline(airline) {
    return (dispatch) => {
        return dispatch(addAirline(airline))
    }
}

export function handleAddFlight(id, flightNumber, departure, arrival, timestamp) {
    return (dispatch) => {

        dispatch(showLoading())
        return storeFlight({ id, flightNumber, departure, arrival, timestamp })
            .then((flight) => { dispatch(addFlight(id, flightNumber,flight)) })
            .then(() => dispatch(hideLoading()))
    }
}

export function handleUpdateFlight(id, flight) {
    console.log(flight)
    return (dispatch) => {
        return dispatch(addFlight(id, flight.flightNumber, flight))
    }
}