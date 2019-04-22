import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'reactstrap';
import { updateContractApi } from '../actions/contractApi'

class Oracles extends Component {

    state = {
        isRegistrationRunning: false,
    }


    handleRegisterOracles = (e) => {

        e.preventDefault()
        this.setState(() => ({
            isRegistrationRunning: true,
        }))

        let _registeredOracles = []
        // alert("Register Oracles ")
        const { contractApi, dispatch } = this.props
        const { TEST_ORACLES_COUNT } = contractApi
        const accounts = contractApi.contract.getAccounts()

        contractApi.contract.getRegistrationFee((error, result) => {
            if (error) {
                console.log(error, result);
            } else {
                const fee = result
                //console.log(fee);
                for (let a = 1; a <= TEST_ORACLES_COUNT; a++) {
                    contractApi.contract.registerOracle(accounts[a], fee, (error, result) => {
                        if (error) {
                            console.log(error, result);
                        }
                    });
                }
                for (let a = 1; a <= TEST_ORACLES_COUNT; a++) {
                    contractApi.contract.getMyIndexes(accounts[a], (error, result) => {
                        if (error) {
                            console.log(error, result);
                        } else {
                            let _registeredOracle = {
                                key: a - 1,
                                account: accounts[a],
                                result0: result[0],
                                result1: result[1],
                                result2: result[2],
                            }
                            _registeredOracles.push(_registeredOracle)
                            //console.log(`Oracle Registered: ${JSON.stringify(_registeredOracle)}`)
                            if (a === TEST_ORACLES_COUNT) {
                                contractApi.registeredOracles = _registeredOracles;
                                contractApi.isOracelsRegistered = true;
                                // update redux
                                dispatch(updateContractApi(contractApi))
                                this.setState(() => ({
                                    isRegistrationRunning: false
                                }))
                            }
                        }
                    });
                }
            }
        });
    }

    render() {

        const { contractApi } = this.props
        const { isOracelsRegistered, registeredOracles } = contractApi
        const { isRegistrationRunning } = this.state

        return (
            <div className="airline-container">
                <h3 className="center">Oracles</h3>
                <div className="airline">
                    <div className='airline-info'>
                        <div>
                            <Button
                                color="primary" size="sm"
                                type="submit"
                                onClick={this.handleRegisterOracles}
                                disabled={isOracelsRegistered === true || isRegistrationRunning === true}
                            >Register</Button>
                        </div>
                        <div>
                            {isOracelsRegistered === true
                                ? (
                                    <div>
                                        {isRegistrationRunning === true
                                            ? <p>Wait registration is running.....</p>
                                            : <ul >
                                                {registeredOracles.map((item) => (
                                                    <li key={item.key}>
                                                        <p>Registered: {item.result0}, {item.result1}, {item.result2}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        }
                                    </div>
                                )
                                : (
                                    <div>
                                        {isRegistrationRunning === true
                                            ? <p>Wait registration is running.....</p>
                                            : <p>Not registered yet.</p>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}


function mapStateToProps({ contractApi }) {
    return {
        contractApi
    }
}
export default connect(mapStateToProps)(Oracles)