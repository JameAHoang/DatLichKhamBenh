import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserManage from "../containers/System/UserManage";
import UserRedux from "../containers/System/Admin/UserRedux";
import Header from "../containers/Header/Header";
import ManageDoctor from "../containers/System/Admin/ManageDoctor";
import ManageSpecialty from "../containers/System/Specialty/ManageSpecialty";
import DetailManageSpecialty from "../containers/System/Specialty/DetailManageSpecialty";
import ManageClinic from "../containers/System/Clinic/ManageClinic";
import DetailManageClinic from "../containers/System/Clinic/DetailManageClinic";
import DataBoard from "../containers/System/Admin/DataBoard";
import ManagePatient from "../containers/System/Patient/ManagePatient";
import ManageHistory from "../containers/System/Doctor/ManageHistory";
class System extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleId: "",
    };
  }
  componentDidMount() {
    let role = this.props.user.userData;
    this.setState({
      roleId: role.roleId,
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  render() {
    const { systemMenuPath } = this.props;
    let { roleId } = this.state;
    console.log("check state", this.state.roleId);
    return (
      <div className="system-container">
        {this.props.isLoggedIn && <Header />}
        <div className="system-list">
          <Switch>
            <Route path="/system/user-manage" component={UserRedux} />
            <Route path="/system/databoard" component={DataBoard} />
            <Route path="/system/manage-doctor" component={ManageDoctor} />
            <Route
              path="/system/manage-specialty"
              component={ManageSpecialty}
            />
            <Route
              path="/system/detail-manage-specialty"
              component={DetailManageSpecialty}
            />
            <Route path="/system/manage-clinic" component={ManageClinic} />
            <Route
              path="/system/detail-manage-clinic"
              component={DetailManageClinic}
            />
            <Route path="/system/manage-history" component={ManageHistory} />
            <Route path="/system/manage-patient" component={ManagePatient} />
            {roleId && roleId === "R1" ? (
              <Route
                component={() => {
                  return <Redirect to={systemMenuPath} />;
                }}
              />
            ) : (
              <Route
                component={() => {
                  return <Redirect to={"/doctor/manage-schedule"} />;
                }}
              />
            )}
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
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
