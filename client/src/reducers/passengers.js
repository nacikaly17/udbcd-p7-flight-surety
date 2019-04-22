import {
    RECEIVE_PASSENGERS,
    ADD_PASSENGER,
} from '../actions/passengers';

export default function airlines(state = {}, action) {
    switch (action.type) {
        case RECEIVE_PASSENGERS:
            return {
                ...state,
                ...action.passengers
            }
        case ADD_PASSENGER:
            return {
                ...state,
                [action.passenger.id]: action.passenger,
            }
        default:
            return state
    }
}

