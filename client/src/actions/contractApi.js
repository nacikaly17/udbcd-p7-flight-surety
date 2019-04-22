
export const RECEIVE_CONTRACTAPI = 'RECEIVE_CONTRACTAPI';
export const SET_CONTRACTAPI = 'SET_CONTRACTAPI';

export function receiveContractApi(contractApi) {
    console.log("1. ", contractApi)
    return {
        type: RECEIVE_CONTRACTAPI,
        contractApi,
    }
}

function setContractApi(contractApi) {
    return {
        type: SET_CONTRACTAPI,
        contractApi,
    }
}

export function updateContractApi(contractApi) {
    return (dispatch) => {
        return dispatch(setContractApi(contractApi))
    }
}
