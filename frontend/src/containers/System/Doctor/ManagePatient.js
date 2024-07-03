import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../components/Input/DatePicker";
import {
  DoctorConfirmSuccess,
  getListPatientForDoctor,
} from "../../../services/userService";
import moment from "moment";
import { CommonUtils, LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import { deleteBookAppointment } from "../../../services/patientService";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      dataPatient: [],
      files: "",
      status: "S2",
    };
  }
  componentDidMount() {
    this.getListPatient(this.state.status);
    // let day = moment.utc("1999-10-10T17:00:00.000Z").format("DD");
    // let month = moment.utc("1999-10-10T17:00:00.000Z").format("MM");
    // let year = moment.utc("1999-10-10T17:00:00.000Z").format("YYYY");
    // let birthday = Number(day) + 1 + "-" + month + "-" + year;
    // console.log("check date", birthday);
  }
  getListPatient = async (status) => {
    console.log("date", this.state.currentDate);
    let date = this.state.currentDate;
    let dateString = moment.unix(date / 1000).format("YYYY-MM-DD");
    let doctorId = this.props.user.userData.id;
    let data = await getListPatientForDoctor(doctorId, dateString, status);
    if (data && data.errCode === 0) {
      this.setState({
        dataPatient: data.data,
      });
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    // if (this.state.currentDate !== prevState.currentDate) {
    //   this.getListPatient();
    // }
  }
  handleOnChangeDataPicker = (date) => {
    this.setState({ currentDate: date[0] });
    this.getListPatient(this.state.status);
  };
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  renderTime = (timeType, currentDate) => {
    let { language } = this.props;
    if (timeType && !_.isEmpty(timeType) && currentDate) {
      let time = timeType.value;
      let date =
        language === LANGUAGES.VI
          ? moment(new Date(currentDate)).format("dddd - DD/MM/YYYY")
          : moment(new Date(currentDate))
              .locale("en")
              .format("ddd - DD/MM/YYYY");

      return `${time} - ${this.capitalizeFirstLetter(date)}`;
    }
    return "";
  };
  handleComfirm = async (data) => {
    if (this.state.status === "S1") {
      let res = await deleteBookAppointment({
        id: data.id,
        statusId: data.statusId,
        timeType: data.timeType,
        date: data.date,
        doctorId: data.doctorId,
      });
      if (res?.errCode === 0) {
        toast.success("Xóa thành công!");
        this.getListPatient(this.state.status);
      } else {
        toast.error("Xóa thất bại");
      }
    }
    if (this.state.status === "S2") {
      if (this.state.files === "") {
        toast.error(
          "Vui lòng chọn đơn thuốc cho bệnh nhân " +
            data.patientData.lastName +
            " " +
            data.patientData.firstName
        );
        return;
      }
      let timeString = this.renderTime(
        data.timeTypeDataPatient,
        this.state.currentDate
      );
      let doctor = this.props.user.userData;

      let res = await DoctorConfirmSuccess({
        email: data.patientData.email,
        statusId: data.statusId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        language: this.props.language,
        patientName:
          data.patientData.lastName + " " + data.patientData.firstName,
        time: timeString,
        doctorName: doctor.lastName + " " + doctor.firstName,
        date: data.date,
        timeType: data.timeType,
        reason: data.reason,
        visit: data.visit,
        files: this.state.files,
      });
      if (res && res.errCode === 0) {
        toast.success("Xác nhận bệnh nhân đã khám bệnh thành công!");
        this.getListPatient(this.state.status);
      } else {
        toast.error("Xác nhận thất bại");
      }
    }
    if (this.state.status === "S3") {
      console.log("check data s3", data);
      this.props.history.push("/doctor/manage-history");
      // let res = await deleteBookAppointment({
      //   id: data.id,
      //   statusId: data.statusId,
      //   timeType: data.timeType,
      //   date: data.date,
      //   doctorId: data.doctorId,
      // });
      // if (res?.errCode === 0) {
      //   toast.success("Xóa thành công!");
      //   this.getListPatient(this.state.status);
      // } else {
      //   toast.error("Xóa thất bại");
      // }
    }
  };
  handleGetbyStatus = (status) => {
    if (status === "S1") {
      this.setState({
        status: status,
      });
      this.getListPatient(status);
    }
    if (status === "S2") {
      this.setState({
        status: status,
      });
      this.getListPatient(status);
    }
    if (status === "S3") {
      this.setState({
        status: status,
      });
      this.getListPatient(status);
    }
  };
  handleOnChangeImage = async (event) => {
    let data = event.target.files;

    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        files: base64,
      });
    }
  };
  render() {
    let { language } = this.props;
    let { dataPatient } = this.state;
    console.log("check list data", this.state.dataPatient);

    // console.log("check state", this.state.currentDate);
    // console.log("check doctor", this.props.user);
    return (
      <>
        <div className="manage-patient-container container">
          <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
          <div className="manage-patient-body">
            <div className="manage-patient-all">
              <div className="col-3">
                <label className="form-label">Chọn ngày khám</label>
                <DatePicker
                  onChange={this.handleOnChangeDataPicker}
                  className="form-control"
                  value={this.state.currentDate}
                  // minDate={yesterday}
                />
              </div>
              <div className="col-3 btn">
                <button
                  type="button"
                  className={
                    this.state.status === "S1"
                      ? "btn-status active"
                      : "btn-status"
                  }
                  onClick={() => this.handleGetbyStatus("S1")}
                >
                  Lịch hẹn mới
                </button>
                <button
                  type="button"
                  className={
                    this.state.status === "S2"
                      ? "btn-status active"
                      : "btn-status"
                  }
                  onClick={() => this.handleGetbyStatus("S2")}
                >
                  Đã xác nhận
                </button>
                <button
                  type="button"
                  className={
                    this.state.status === "S3"
                      ? "btn-status active"
                      : "btn-status"
                  }
                  onClick={() => this.handleGetbyStatus("S3")}
                >
                  Đã khám xong
                </button>
              </div>
            </div>
            <table id="customers">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Thời gian</th>
                  <th>Mã bệnh nhân</th>
                  <th>
                    <FormattedMessage id="manage-user.fullname" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-user.gender" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-user.phone-number" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-user.birthday" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-user.address" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-user.reason" />
                  </th>
                  <th>Lần đăng ký khám</th>

                  {this.state.status !== "S1" && <th>Đơn thuốc</th>}
                  {this.state.status !== "S3" && (
                    <th>
                      <FormattedMessage id="manage-user.action" />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataPatient && dataPatient.length > 0 ? (
                  dataPatient.map((res, index) => {
                    let day = moment.utc(res.patientData.birthday).format("DD");
                    let month = moment
                      .utc(res.patientData.birthday)
                      .format("MM");
                    let year = moment
                      .utc(res.patientData.birthday)
                      .format("YYYY");
                    let birthday = Number(day) + 1 + "/" + month + "/" + year;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{res.timeTypeDataPatient.value}</td>
                        <td>{res.patientId}</td>
                        <td>
                          {res.patientData.lastName +
                            " " +
                            res.patientData.firstName}
                        </td>
                        <td>{res.patientData.genderDataPatient.value}</td>
                        <td>{res.patientData.phoneNumber}</td>
                        <td>{birthday}</td>
                        <td>{res.patientData.address}</td>
                        <td>{res.reason}</td>
                        <td>{res.visit}</td>
                        {this.state.status !== "S1" && (
                          <td>
                            <div className="preview-img-container">
                              <input
                                type="file"
                                id="previewImg"
                                hidden
                                onChange={(event) => {
                                  this.handleOnChangeImage(event);
                                }}
                              />
                              <div className="upload">
                                <label
                                  htmlFor="previewImg"
                                  className="label-upload"
                                >
                                  Đơn thuốc <i className="fas fa-upload"></i>
                                </label>
                              </div>
                            </div>
                          </td>
                        )}

                        {this.state.status !== "S3" && (
                          <td>
                            <button
                              type="button"
                              className="btn-comfirm"
                              onClick={() => this.handleComfirm(res)}
                            >
                              {this.state.status === "S2" ? "Xác nhận" : "Xóa"}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "center" }}>
                      Không có dữ liệu bệnh nhân đặt lịch khám
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
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
