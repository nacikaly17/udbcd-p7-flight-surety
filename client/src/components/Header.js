import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap';
import logo from '../images/favicon.ico';
import Nav from './Nav'

class Header extends Component {


    render() {

        return (
            <div className="header">
                <Row>
                    <Col xs="3">
                        <img src={logo} alt="Logo" />
                    </Col>
                    <Col xs="auto">
                        <h1>Flight Delay Insurance</h1>
                    </Col>
                </Row>
                <Nav />
            </div>
        )
    }
}

function mapStateToProps({ airlines }) {
    return {
        airlines,
    }
}
export default connect(mapStateToProps)(Header)