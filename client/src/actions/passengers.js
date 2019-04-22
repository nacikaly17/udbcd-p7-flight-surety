
export const ADD_PASSENGER = 'ADD_PASSENGER';
export const RECEIVE_PASSENGERS = 'RECEIVE_PASSENGERS';


export function receivePassengers(passengers) {
    return {
        type: RECEIVE_PASSENGERS,
        passengers,
    }
}


function addPassenger(passenger) {
    return {
        type: ADD_PASSENGER,
        passenger,
    }
}

export function handleUpdatePassenger(passenger) {
    return (dispatch) => {
        return dispatch(addPassenger(passenger))
    }
}

