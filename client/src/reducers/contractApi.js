import {
    RECEIVE_CONTRACTAPI,
    SET_CONTRACTAPI,
} from '../actions/contractApi';


export default function airlines(state = {}, action) {
    switch (action.type) {
        case RECEIVE_CONTRACTAPI:
            return {
                ...state,
                ...action.contractApi
            }
        case SET_CONTRACTAPI:
            return {
                ...state,
                [action.contractApi]: action.contractApi,
            }
        default:
            return state
    }
}

