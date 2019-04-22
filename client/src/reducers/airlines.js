import {
    RECEIVE_AIRLINES,
    ADD_AIRLINE,
    ADD_FLIGHT
} from '../actions/airlines';

export default function airlines(state = {}, action) {
    switch (action.type) {
        case RECEIVE_AIRLINES:
            return {
                ...state,
                ...action.airlines
            }
        case ADD_AIRLINE:
            return {
                ...state,
                [action.airline.id]: action.airline,
            }
        case ADD_FLIGHT:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    flights: {
                        ...state[action.id].flights,
                        // [action.flight.flightNunber]: action.flight
                        [action.flightNumber]: action.flight
                    }
                }
            }
        default:
            return state
    }
}

