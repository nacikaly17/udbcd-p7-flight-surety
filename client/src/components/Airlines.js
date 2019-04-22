import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap';
import Airline from './Airline'


class Airlines extends Component {


    render() {
        const { airlineIds, contractApi } = this.props

        if (!contractApi.isOperational) {
            return <div className="center">Contract is not operational...</div>;
        }
        return (
            <div >
                <h3 className="center">Airlines</h3>
                <Row>
                    <Col sm="12">
                        <ul >
                            {airlineIds.map((id) => (
                                <li key={id}>
                                    <Airline id={id}></Airline>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </div>
        )
    }
}


function mapStateToProps({ airlines, contractApi }) {
    return {
        airlines,
        contractApi,
        airlineIds: Object.keys(airlines)
    }
}
export default connect(mapStateToProps)(Airlines)