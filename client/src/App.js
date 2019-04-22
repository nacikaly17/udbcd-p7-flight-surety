import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import Header from './components/Header'
import Airlines from './components/Airlines'
import AirlinePage from './components/AirlinePage'
import AddAirline from './components/AddAirline'
import AddFlight from './components/AddFlight'
import Oracles from './components/Oracles'
import NotFound from './components/NotFound'
import { fakeAuth } from './utils/helpers'
import Contract from "./utils/contract";
import DappOperation from "./components/DappOperation";
import { handleInitialData } from './actions/shared'
import InsuranceProcedure from './components/InsuranceProcedure'
import RegistrationProcedure from './components/RegistrationProcedure'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }} />
  )} />
)

class App extends Component {

  state = {
    contractApi: null,
  };

  componentDidMount = async () => {

    let contractApi = {
      contract: null,
      isOperational: false,
      statusText: '',
      TEST_ORACLES_COUNT: 19,
      isOracLesRegistered: false,
      registeredOracles: [],
    }


    let airlineAdresses = []
    let passengerAdresses = []
    let contract = new Contract('localhost', () => {

      contract.authorizeCaller((error1, result1) => {

        contract.isOperational((error, result) => {
          console.log(error, result);
          if (error) {
            this.props.dispatch(handleInitialData(contractApi, airlineAdresses, passengerAdresses))
            this.setState(
              {
                contractApi: null,
              }
            );
          } else {
            contractApi.contract = contract;
            contractApi.isOperational = true;
            airlineAdresses = contract.getAirlineAdresses()
            passengerAdresses = contract.getPassengerAdresses()
            // console.log(airlineAdresses)
            this.props.dispatch(handleInitialData(contractApi, airlineAdresses, passengerAdresses))
            this.setState(
              {
                contractApi: contractApi,
              }
            );
          }
        });

      });

    });

  };

  render() {

    if (!this.state.contractApi) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const { loading } = this.props

    return (
      <Router>
        <Fragment>
          <LoadingBar />
          <Header />
          <div >
            {loading === true
              ? null
              : <div>
                <Switch>
                  <Route path='/' exact component={Airlines} />
                  <Route path='/addAirline' exact component={AddAirline} />
                  <Route path='/oracles' exact component={Oracles} />
                  <Route path='/config' exact component={DappOperation} />
                  <PrivateRoute path='/registrationProcedure/:id/:flightNumber' component={RegistrationProcedure} />
                  <PrivateRoute path='/insuranceProcedure/:id/:flightNumber' component={InsuranceProcedure} />
                  <PrivateRoute path='/airlines/:id' component={AirlinePage} />
                  <PrivateRoute path='/addFlight/airlines/:id' component={AddFlight} />
                  <Route path='/*' component={NotFound} />
                </Switch>
              </div>}
          </div>
        </Fragment>
      </Router >
    )
  }
}


function mapStateToProps({ airlines }) {
  return {
    airlines,
    loading: airlines === null
  }
}
export default connect(mapStateToProps)(App)
