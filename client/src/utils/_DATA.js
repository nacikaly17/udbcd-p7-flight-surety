

let airlines = {
    ND: {
        id: 'ND',
        name: 'FirstAirline',
        country: 'Germany',
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: '',  // account[0]
        isFetched: false,
        flights: {
            "1309": {
                flightNumber: '1309',
                flightDate: Math.floor(Date.now() / 1000),
                departure: 'IST',
                arrival: 'FRA',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
        }
    },
    LH: {
        id: 'LH',
        name: 'Lufthansa',
        country: 'Germany',
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: '',  // account[1]
        isFetched: false,
        flights: {
            "403": {
                flightNumber: '403',
                flightDate: Math.floor(Date.now() / 1000),
                departure: 'FRA',
                arrival: 'FCO',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
        }
    },
    AF: {
        id: 'AF',
        name: 'Air France',
        country: 'France',
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: '',  // account[2]
        isFetched: false,
        flights: {
            "1319": {
                flightNumber: '1319',
                flightDate: Date.now(),
                departure: 'FRA',
                arrival: 'CDG',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
        }
    },
    BA: {
        id: 'BA',
        name: 'Britisch Airways',
        country: 'United Kingdom',
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: '',  // account[3]
        isFetched: false,
        flights: {
            "901": {
                flightNumber: '901',
                flightDate: Date.now(),
                departure: 'FRA',
                arrival: 'LHR',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
            "902": {
                flightNumber: '902',
                flightDate: Date.now(),
                departure: 'LHR',
                arrival: 'FRA',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
        }
    },
    KL: {
        id: 'KL',
        name: 'KLM',
        country: 'Netherlands',
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: '',  // account[4],
        isFetched: false,
        flights: {
            "1774": {
                flightNumber: '1774',
                flightDate: Date.now(),
                departure: 'FRA',
                arrival: 'AMS',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
            "1764": {
                flightNumber: '1764',
                flightDate: Date.now(),
                departure: 'FRA',
                arrival: 'BCN',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            },
        }
    },
    TK: {
        id: 'TK',
        name: 'Turkish Airlines',
        country: 'Turkey',
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: '',  // account[5]
        isFetched: false,
        flights: {
            "1598": {
                flightNumber: '1598',
                flightDate: Date.now(),
                departure: 'FRA',
                arrival: 'IST',
                isRegisteredFlight: false,
                flightStatus: 0,
                isFetched: false,
            }
        }
    },
}
let passengers = {
    P1: {
        id: 'P1',
        address: '',  // account[6] passenger address
    },
    P2: {
        id: 'P2',
        address: '',  // account[7] passenger address
    },
    P3: {
        id: 'P3',
        address: '',  // account[8] passenger address
    },
    P4: {
        id: 'P4',
        address: '',  // account[9] passenger address
    },
    P5: {
        id: 'P5',
        address: '',  // account[10] passenger address
    },
}

export function formatAirline(info) {
    return {
        id: info.id,
        name: info.name,
        country: info.country,
        created: Date.now(),
        isRegistered: false,
        isFunded: false,
        funds: 0,
        address: info.address,
        isFetched: false,
        flights: {},
    }
}

export function formatFlight(info) {
    return {
        flightNumber: info.flightNumber,
        flightDate: info.timestamp,
        departure: info.departure,
        arrival: info.arrival,
        isRegisteredFlight: false,
        flightStatus: 0,
        isFetched: false,
    }
}

export function _getAirlines(airlineAdresses) {

    const result = Object.keys(airlines).map(id => (
        airlines[id]
    ));
    // return result;
    //console.log("result:", result)
    for (let index = 0; index < result.length; index++) {
        if (index < result.length) {
            let id = result[index].id
            // console.log(id)
            airlines[id].address = airlineAdresses[index];
        }
    }

    return new Promise((res, rej) => {
        setTimeout(() => res({ ...airlines }), 1000)
    })
}

export function _getPassengers(passengerAdresses) {

    const result = Object.keys(passengers).map(id => (
        passengers[id]
    ));
    // return result;
    //console.log("result:", result)
    for (let index = 0; index < result.length; index++) {
        if (index < result.length) {
            let id = result[index].id
            // console.log(id)
            passengers[id].address = passengerAdresses[index];
        }
    }

    return new Promise((res, rej) => {
        setTimeout(() => res({ ...passengers }), 1000)
    })
}


export function _storeAirline(info) {
    return new Promise((res, rej) => {
        const airline = formatAirline(info);
        setTimeout(() => {
            airlines = {
                ...airlines,
                [airline.id]: airline
            }
            res(airline)
        }, 1000)
    })
}
export function _storeFlight(info) {
    return new Promise((res, rej) => {
        const id = info.id
        const flight = formatFlight(info);
        const flightNumber = flight.flightNumber
        setTimeout(() => {
            airlines = {
                ...airlines,
                [id]: {
                    ...airlines[id],
                    flights: {
                        ...airlines[id].flights,
                        [flightNumber]: flight
                    }
                }
            }
            res(flight)
        }, 1000)
    })
}

