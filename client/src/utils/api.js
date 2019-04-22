
import {
    _getAirlines,
    _getPassengers,
    _storeAirline,
    _storeFlight,
} from './_DATA.js'
import Config from './config.json';

export function getInitialData(airlineAdresses, passengerAdresses) {

    return Promise.all([
        _getAirlines(airlineAdresses),
        _getPassengers(passengerAdresses)
    ]).then(([airlines, passengers]) => (
        { airlines, passengers }))
}


export function storeAirline(info) {
    return _storeAirline(info)
}

export function storeFlight(info) {
    return _storeFlight(info)
}

export function getConfigJSON() {

    let config = Config['localhost'];
    let url = config.url
    let appAddress = config.appAddress
    let dataAddress = config.dataAddress
    let result = {
        url: url,
        appAddress: appAddress,
        dataAddress: dataAddress
    }
    //console.log(result)
    return result
}