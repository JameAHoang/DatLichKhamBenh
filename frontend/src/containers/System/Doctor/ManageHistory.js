import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageHistory.scss";
import { FormattedMessage } from "react-intl";
import moment from "moment";

import {
  getHistoryPatient,
  searchHistoryPatient,
} from "../../../services/patientService";
import { CommonUtils } from "../../../utils";
class ManageHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHistory: [],
    };
  }
  componentDidMount() {
    this.getHistoryPatientData();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  getHistoryPatientData = async () => {
    let res = await getHistoryPatient();
    console.log("check res", res);
    if (res?.errCode === 0) {
      this.setState({
        listHistory: res?.data,
      });
    }
  };
  handleOnChangeInput = async (e) => {
    let res = await searchHistoryPatient(e.target.value);
    if (res?.errCode === 0) {
      this.setState({
        listHistory: res?.data,
      });
    }
  };
  handleDetailHistory = async (data) => {
    console.log(data.files);
  };
  render() {
    let { listHistory } = this.state;
    return (
      <>
        <div className="manage-doctor-container container">
          <div className="m-p-title">
            Quản lý lịch sử khám bệnh của bệnh nhân
          </div>
          <div className="searchPatient">
            <input
              className="form-control"
              onChange={(e) => this.handleOnChangeInput(e)}
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="manage-doctor-body">
            <table id="customers">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã bệnh nhân</th>
                  <th>Tên bệnh nhân</th>
                  <th>Giới tính</th>
                  <th>Năm sinh</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Tên bác sĩ khám</th>
                  <th>Thời gian</th>
                  <th>Lí do khám bệnh</th>
                  <th>Lần đăng ký khám</th>
                  <th>Đơn thuốc</th>
                </tr>
              </thead>
              <tbody>
                {listHistory && listHistory.length > 0 ? (
                  listHistory.map((res, index) => {
                    let day = moment
                      .utc(res.patientDataHistory.birthday)
                      .format("DD");
                    let month = moment
                      .utc(res.patientDataHistory.birthday)
                      .format("MM");
                    let year = moment
                      .utc(res.patientDataHistory.birthday)
                      .format("YYYY");
                    let birthday = Number(day) + 1 + "/" + month + "/" + year;

                    let dayDate = moment.utc(res.date).format("DD");
                    let monthDate = moment.utc(res.date).format("MM");
                    let yearDate = moment.utc(res.date).format("YYYY");
                    let date =
                      Number(dayDate) + 1 + "/" + monthDate + "/" + yearDate;
                    return (
                      <tr
                        key={index}
                        onClick={() => {
                          this.handleDetailHistory(res);
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{res.patientId}</td>
                        <td>
                          {res.patientDataHistory.lastName +
                            " " +
                            res.patientDataHistory.firstName}
                        </td>
                        <td>
                          {res.patientDataHistory.genderDataPatient.value}
                        </td>
                        <td>{birthday}</td>
                        <td>{res.patientDataHistory.phoneNumber}</td>
                        <td>{res.patientDataHistory.address}</td>
                        <td>
                          {res.doctorDataHistory.lastName +
                            " " +
                            res.doctorDataHistory.firstName}
                        </td>
                        <td>{res.timeTypeDataHistory.value + " - " + date}</td>
                        <td>{res.reason}</td>
                        <td>{res.visit}</td>
                        <td>
                          <a
                            download={
                              res.patientDataHistory.lastName +
                              " " +
                              res.patientDataHistory.firstName +
                              ".txt"
                            }
                            href={res.files}
                          >
                            <i className="fas fa-download"></i>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center" }}>
                      Không có dữ liệu lịch sử bệnh nhân
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageHistory);
