import StatusCodes from './StatusCodes'

export const fakeAuth = {
    isAuthenticated: true,
    authenticate(cb) {
        this.isAuthenticated = true
        setTimeout(cb, 100)
    },
    signout(cb) {
        this.isAuthenticated = false
        setTimeout(cb, 100)
    }
}


export function getStatusText(status) {
    let text;

    switch (status) {
        case StatusCodes.STATUS_CODE_UNKNOWN:
            text = "UNKNOWN!";
            break;
        case StatusCodes.STATUS_CODE_ON_TIME:
            text = "ON_TIME!";
            break;
        case StatusCodes.STATUS_CODE_LATE_AIRLINE:
            text = "LATE_AIRLINE!";
            break;
        case StatusCodes.STATUS_CODE_LATE_WEATHER:
            text = "LATE_WEATHER!";
            break;
        case StatusCodes.STATUS_CODE_LATE_TECHNICAL:
            text = "LATE_TECHNICAL!";
            break;
        default:
            text = "LATE_OTHER!";
    }
    return text;
}

