import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log("check props", this.props.user);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  render() {
    const { isLoggedIn } = this.props;
    let role = this.props.user;
    let linkToRedirect = "";
    if (role && role.userData && role.userData.roleId === "R1") {
      linkToRedirect = isLoggedIn ? "/system/databoard" : "/home";
    } else {
      linkToRedirect = isLoggedIn ? "/doctor/manage-schedule" : "/home";
    }

    return <Redirect to={linkToRedirect} />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
