import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { handleLoginApi } from "../../services/userService";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";

import "./Login.scss";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
    };
  }
  handleOnChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };
  handleOnChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };
  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      if (this.state.username === "") {
        this.setState({
          errMessage: "Vui lòng nhập email!",
        });
        return;
      }
      if (this.state.password === "") {
        this.setState({
          errMessage: "Vui lòng nhập mật khẩu!",
        });
        return;
      }
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      this.setState({ errMessage: error.response.data.message });
    }
  };
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  };
  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };
  render() {
    return (
      <>
        <div className="login-background">
          <div className="login-container">
            <div className="login-content row">
              <div className="col-12 text-login">Đăng nhập hệ thống</div>
              <div className="col-12 form-group input-login">
                <label>Email đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập email"
                  value={this.state.username}
                  onChange={(e) => this.handleOnChangeUsername(e)}
                ></input>
              </div>
              <div className="col-12 form-group input-login">
                <label>Mật khẩu</label>
                <div className="custom-input-password">
                  <input
                    type={this.state.isShowPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={this.state.password}
                    onChange={(e) => this.handleOnChangePassword(e)}
                    onKeyPress={this.handleKeyDown}
                  ></input>
                  <span onClick={() => this.handleShowHidePassword()}>
                    <i
                      className={
                        this.state.isShowPassword
                          ? "far fa-eye"
                          : "far fa-eye-slash"
                      }
                    ></i>
                  </span>
                </div>
              </div>
              <div className="col-12" style={{ color: "red" }}>
                {this.state.errMessage}
              </div>
              <div className="col-12">
                <button
                  className="btn-login"
                  onClick={() => this.handleLogin()}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
        ;
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
    userLoginFail: () => dispatch(actions.userLoginFail()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
