import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
// import Login from '../routes/Login';
import Login from "./Auth/Login";
import Header from "./Header/Header";
import System from "../routes/System";

import HomePage from "./HomePage/HomePage.js";

import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import Doctor from "../routes/Doctor";
import "./App.scss";
import ScrollTop from "../components/ScroolTop";
import { Scrollbars } from "react-custom-scrollbars";
import VerifyEmail from "./Patient/VerifyEmail";
import ErrorPage from "./HomePage/ErrorPage";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import BookingSuccess from "./Patient/Doctor/Modal/BookingSuccess";
import Clinic from "./Patient/Clinic/Clinic";
import Specialty from "./Patient/Specialty/Specialty";
import SearchDoctor from "./Patient/Doctor/SearchDoctor";

class App extends Component {
  ref = React.createRef();
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }
  handleScrollTop = () => {
    const scrollbars = this.ref.current;
    {
      scrollbars && scrollbars.scrollToTop();
    }
  };

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            {/* {this.props.isLoggedIn && <Header />} */}
            <ScrollTop handleScrollTop={this.handleScrollTop} />
            <div className="content-container">
              <Scrollbars
                ref={this.ref}
                style={{ height: "100vh", width: "100%" }}
              >
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={path.DOCTOR}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />

                  <Route path={path.ERROR_PAGE} component={ErrorPage} />

                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route
                    path={path.BOOKING_SUCCESS}
                    component={BookingSuccess}
                  />
                  <Route path={path.CLINIC} component={Clinic} />
                  <Route path={path.SPECAILTY} component={Specialty} />
                  <Route path={path.SEARCH_DOCTOR} component={SearchDoctor} />

                  <Route
                    component={() => {
                      return <Redirect to={"/error"} />;
                    }}
                  />
                </Switch>
              </Scrollbars>
            </div>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
