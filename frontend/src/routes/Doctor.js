import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import Header from "../containers/Header/Header";
import ManagePatient from "../containers/System/Doctor/ManagePatient";
import ManageHistory from "../containers/System/Doctor/ManageHistory";
class Doctor extends Component {
  render() {
    const { systemMenuPath } = this.props;
    return (
      <div className="system-container">
        {this.props.isLoggedIn && <Header />}
        <div className="system-list">
          <Switch>
            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
            <Route path="/doctor/manage-patient" component={ManagePatient} />
            <Route path="/doctor/manage-history" component={ManageHistory} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
