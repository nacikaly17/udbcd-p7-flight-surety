import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap';
import { handleUpdateAirline } from '../actions/airlines'

class Airline extends Component {


    readAirlineData() {

        const { airline, dispatch, contractApi } = this.props
        if (contractApi.contract !== null) {
            contractApi.contract.getAirlineData(
                airline.address,
                (error, result1) => {
                    if (!error) {
                        //console.log(result1)
                        // update redux
                        airline.id = result1[0]
                        airline.name = result1[1]
                        airline.country = result1[2]
                        airline.funds = result1[3]
                        airline.isRegistered = result1[4]
                        airline.isFunded = result1[5]
                        airline.isFetched = true
                        dispatch(handleUpdateAirline(airline))
                    }
                });
        }
    }

    render() {

        const { airline } = this.props

        if (airline === null) {
            return <p>This Airline doesn't exist</p>
        }

        const {
            id,
            name,
            country,
            created,
            isRegistered,
            isFunded,
            funds,
            address,
            isFetched,
        } = airline

        if (!isFetched) {
            // read airline data from contract
            this.readAirlineData()
        }

        // Convert timestamp to string
        var date = new Date(created);
        var createdString = date.toDateString() + '  ' + date.toString().slice(16, 21)


        return (
            <div className='airline-container'>
                <Link to={`/airlines/${id}`}>
                    <div>
                        <p className="center">{id} : {name} ({country})</p>
                    </div>
                    <div className='airline'>
                        <div className='airline-info'>
                            <Row>
                                <Col sm="3">
                                    <span>Address : </span>
                                </Col>
                                <Col sm="9">
                                    <span>{address} </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="3">
                                    <span>Registered : </span>
                                </Col>
                                <Col sm="9">
                                    {isRegistered
                                        ? <span className='text-green'> Yes </span>
                                        : <span> No </span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="3">
                                    <span>Funded : </span>
                                </Col>
                                <Col sm="9">
                                    {isFunded
                                        ? <span className='text-green'> Yes </span>
                                        : <span> No </span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="3">
                                    <span>Funds : </span>
                                </Col>
                                <Col sm="9">
                                    <span>{funds} </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="3">
                                    <span>Created : </span>
                                </Col>
                                <Col sm="9">
                                    <span>{createdString} </span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}


function mapStateToProps({ airlines, contractApi }, { id }) {
    const airline = airlines[id]
    return {
        airline,
        contractApi
    }
}
export default connect(mapStateToProps)(Airline)