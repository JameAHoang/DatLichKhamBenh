import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { FormattedMessage } from "react-intl";
import "./DataBoard.scss";
import {
  getCountClinic,
  getCountDoctor,
  getCountPatient,
  getCountSpecialty,
} from "../../../services/userService";
class DataBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: [],
    };
  }
  componentDidMount() {
    this.handleGetCountDoctor();
    this.handleGetCountPatient();
    this.handleGetCountSpecialty();
    this.handleGetCountClinic();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleClick = (data) => {
    if (data === "doctor") {
      this.props.history.push("/system/user-manage");
    }
    if (data === "patient") {
      this.props.history.push("/system/manage-patient");
    }
    if (data === "specialty") {
      this.props.history.push("/system/manage-specialty");
    }
    if (data === "clinic") {
      this.props.history.push("/system/manage-clinic");
    }
  };
  handleGetCountDoctor = async () => {
    let res = await getCountDoctor();
    if (res?.errCode === 0) {
      this.setState({
        count: { ...this.state.count, countDoctor: res?.data },
      });
    }
  };
  handleGetCountPatient = async () => {
    let res = await getCountPatient();
    if (res?.errCode === 0) {
      this.setState({
        count: { ...this.state.count, countPatient: res?.data },
      });
    }
  };
  handleGetCountSpecialty = async () => {
    let res = await getCountSpecialty();
    if (res?.errCode === 0) {
      this.setState({
        count: { ...this.state.count, countSpecialty: res?.data },
      });
    }
  };
  handleGetCountClinic = async () => {
    let res = await getCountClinic();
    if (res?.errCode === 0) {
      this.setState({
        count: { ...this.state.count, countClinic: res?.data },
      });
    }
  };
  render() {
    let { language } = this.props;
    let { count } = this.state;
    console.log("check state", this.state.count);
    return (
      <>
        <div className="title">DANH SÁCH THỐNG KÊ</div>
        <div className="container databoard-main">
          <div
            className="doctor databoard-content-list"
            onClick={() => this.handleClick("doctor")}
          >
            <div className="icon">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="title-name">DANH SÁCH BÁC SĨ</div>
            <div className="count">{count.countDoctor}</div>
          </div>
          <div
            className="patient databoard-content-list"
            onClick={() => this.handleClick("patient")}
          >
            <div className="icon">
              <i className="fas fa-blind"></i>
            </div>
            <div className="title-name">DANH SÁCH BỆNH NHÂN</div>
            <div className="count">{count.countPatient}</div>
          </div>
          <div
            className="specialty databoard-content-list"
            onClick={() => this.handleClick("specialty")}
          >
            <div className="icon">
              <i className="fas fa-stethoscope"></i>
            </div>
            <div className="title-name"> DANH SÁCH CHUYÊN KHOA</div>
            <div className="count">{count.countSpecialty}</div>
          </div>
          <div
            className="clinic databoard-content-list"
            onClick={() => this.handleClick("clinic")}
          >
            <div className="icon">
              <i className="fas fa-hospital"></i>
            </div>
            <div className="title-name"> DANH SÁCH CƠ SỞ Y TẾ</div>
            <div className="count">{count.countClinic}</div>
          </div>
        </div>
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
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DataBoard)
);
