import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom'
import { getConfigJSON } from '../utils/api'
import { updateContractApi } from '../actions/contractApi'

class DappOperation extends Component {

    state = {
        config: '',
        toHome: false,
    };

    componentDidMount() {

        let result = getConfigJSON()
        this.setState(() => ({
            config: result
        }))

    };

    handleSetOperational = (e) => {
        e.preventDefault()


        const { contractApi, dispatch } = this.props

        if (contractApi.contract !== null) {
            let newStatus = !contractApi.isOperational;
            console.log("new Status:", newStatus)
            contractApi.contract.setOperatingStatus(newStatus, (error, result1) => {
                if (error) {
                    console.log(error, result1);
                    alert(error)
                } else {
                    contractApi.contract.isOperational((error2, result2) => {
                        if (error2) {
                            console.log(error2, result2);
                            alert(error)
                        } else {
                            contractApi.isOperational = result2;
                            // update redux
                            dispatch(updateContractApi(contractApi))
                        }
                    });
                }
            });
        }
    }

    render() {
        const { contractApi, passengers, passengerIds } = this.props
        const { config, toHome } = this.state

        let owner = ''

        if (contractApi.isOperational) {
            owner = contractApi.contract.getOwner()
        }

        if (toHome === true) {
            return <Redirect to='/' />
        }

        return (
            <div >
                <h3 className="center">Dapp-Operation</h3>
                <Row>
                    <Col sm="12">
                        <div className='airline-container'>
                            <div>
                                <p className="center">Contracts are migrated to local Ganache</p>
                            </div>
                            <div className='airline'>
                                <div className='airline-info'>
                                    <Row>
                                        <Col sm="3">
                                            <span>Localhost</span>
                                        </Col>
                                        <Col sm="9">
                                            <p>{config.url}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>FlightSuretyData</span>
                                        </Col>
                                        <Col sm="9">
                                            <p>{config.dataAddress}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>FlightSuretyApp</span>
                                        </Col>
                                        <Col sm="9">
                                            <p>{config.appAddress}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="3">
                                            <span>Contract Owner</span>
                                        </Col>
                                        <Col sm="9">
                                            <p>{owner}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="4">
                                            <span>Contract isOperational: </span>
                                        </Col>
                                        <Col sm="8">
                                            {contractApi.isOperational
                                                ? <span className='text-green'>Yes </span>
                                                : <span className='text-red'>No </span>
                                            }
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className='airline-container'>
                                <div>
                                    <p className="center">Passengers</p>
                                </div>
                                <div className='airline'>
                                    <div className='airline-info'>
                                        <ul >
                                            {passengerIds.map((id) => (
                                                <li key={id}>
                                                    <Row>
                                                        <Col sm="3">
                                                            <span>{id}</span>
                                                        </Col>
                                                        <Col sm="9">
                                                            <p>{passengers[id].address}</p>
                                                        </Col>
                                                    </Row>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className='center'>
                                <p></p>
                                <Row>
                                    <Col sm="6">
                                        <Button
                                            color="primary" size="sm"
                                            type="submit"
                                            onClick={() => this.setState(() => ({
                                                toHome: true,
                                            }))}
                                        >Back</Button>
                                    </Col>
                                    <Col sm="6">
                                        {contractApi.isOperational
                                            ? (
                                                <Button
                                                    color="primary" size="sm"
                                                    type="submit"
                                                    onClick={this.handleSetOperational}
                                                ><span className='text-red'>Set Operation OFF </span></Button>
                                            )
                                            : (
                                                <Button
                                                    color="primary" size="sm"
                                                    type="submit"
                                                    onClick={this.handleSetOperational}
                                                ><span className='text-green'>Set Operation ON </span></Button>
                                            )
                                        }
                                    </Col>
                                </Row>
                                <p></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps({ airlines, contractApi, passengers }) {
    return {
        airlines,
        contractApi,
        passengers,
        passengerIds: Object.keys(passengers)
    }
}
export default connect(mapStateToProps)(DappOperation)