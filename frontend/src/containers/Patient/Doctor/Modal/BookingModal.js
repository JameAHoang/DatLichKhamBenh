import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions/";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import { withRouter } from "react-router";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: this.props.dataTime.doctorId,
      genders: "",
      timeType: this.props.dataTime.timeType,
    };
  }

  clearInput = () => {
    this.setState({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
    });
  };
  componentDidMount() {
    this.props.getGender();
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = item.value;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    // if (this.props.dataTime !== prevProps.dataTime) {
    //   if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
    //     console.log("check datatime", this.props.dataTime);
    //     this.setState({
    //       doctorId: this.props.dataTime.doctorId,
    //       timeType: this.props.dataTime.timeType,
    //     });
    //   }
    // }
  }
  toggle = () => {
    this.props.closeBookingModal();
  };
  handleOnChangeInput = (e, id) => {
    let valueInput = e.target.value;
    let copyState = { ...this.state };
    copyState[id] = valueInput;
    this.setState({
      ...copyState,
    });
  };
  handleOnChangeDataPicker = (date) => {
    this.setState({ birthday: date[0] });
  };
  handleChangeSelect = async (selectedGender) => {
    this.setState({ selectedGender });
  };
  renderTimeBooking = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let time = dataTime.timeTypeData.value;

      let date = moment(new Date(dataTime.date)).format("dddd - DD/MM/YYYY");

      return `${time} - ${this.capitalizeFirstLetter(date)}`;
    }
    return "";
  };
  buildDoctorName = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let name = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;

      return name;
    }
  };
  handleConfirmBooking = async () => {
    //validate input
    if (!this.state.firstName) {
      toast.error("Vui lòng nhập tên!");
      return;
    }
    if (!this.state.lastName) {
      toast.error("Vui lòng nhập Họ!");
      return;
    }
    if (!this.state.phoneNumber) {
      toast.error("Vui lòng nhập Số điện thoại!");
      return;
    }
    if (!this.state.email) {
      toast.error("Vui lòng nhập Email!");
      return;
    }
    if (!this.state.address) {
      toast.error("Vui lòng nhập Địa chỉ!");
      return;
    }
    if (!this.state.reason) {
      toast.error("Vui lòng nhập Lý do khám!");
      return;
    }
    if (!this.state.birthday) {
      toast.error("Vui lòng nhập Ngày sinh!");
      return;
    }
    if (!this.state.selectedGender) {
      toast.error("Vui lòng nhập Giới tính!");
      return;
    }
    let timeString = this.renderTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);

    let res = await postPatientBookAppointment({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataTime.date,
      birthday: this.state.birthday,
      gender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      timeString: timeString,
      doctorName: doctorName,
    });
    console.log("check res", res);
    if (res && res.errCode === 0) {
      toast.success("Bạn đã đặt lịch khám bệnh thành công!");
      this.props.history.push(`/booking-success`);
      this.props.closeBookingModal();
      this.clearInput();
    } else {
      toast.error("Bạn đã đặt lịch khám bệnh thất bại!");
    }
  };
  render() {
    let { language, dataTime } = this.props;
    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";

    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => this.toggle()}
        size="lg"
        centered
        className={"booking-modal-container"}
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="right" onClick={() => this.toggle()}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            {/* {JSON.stringify(dataTime)} */}
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId}
                isShow={false}
                dataTime={dataTime}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>

            <div className="row">
              <div className="col-6 form group">
                <label>Tên</label>
                <input
                  className="form-control"
                  value={this.state.firstName}
                  onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                />
              </div>
              <div className="col-6 form group">
                <label>Họ</label>
                <input
                  className="form-control"
                  value={this.state.lastName}
                  onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                />
              </div>
              <div className="col-6 form group">
                <label>Số điện thoại</label>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(e) => this.handleOnChangeInput(e, "phoneNumber")}
                />
              </div>
              <div className="col-6 form group">
                <label>Email</label>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(e) => this.handleOnChangeInput(e, "email")}
                />
              </div>
              <div className="col-12 form group">
                <label>Địa chỉ liên hệ</label>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(e) => this.handleOnChangeInput(e, "address")}
                />
              </div>
              <div className="col-12 form group">
                <label>Lý do khám</label>
                <input
                  className="form-control"
                  value={this.state.reason}
                  onChange={(e) => this.handleOnChangeInput(e, "reason")}
                />
              </div>
              <div className="col-6 form group">
                <label>Ngày sinh</label>
                <DatePicker
                  onChange={this.handleOnChangeDataPicker}
                  className="form-control"
                  value={this.state.birthday}
                  // minDate={yesterday}
                />
              </div>
              <div className="col-6 form group">
                <label>Giới tính</label>
                <Select
                  value={this.state.selectedGender}
                  onChange={this.handleChangeSelect}
                  options={this.state.genders}
                  placeholder={
                    <FormattedMessage id="patient.booking-modal.gender" />
                  }
                />
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              Xác nhận
            </button>
            <button
              className="btn-booking-cancel"
              onClick={() => this.toggle()}
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGender: () => dispatch(actions.fetchGenderStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookingModal)
);
