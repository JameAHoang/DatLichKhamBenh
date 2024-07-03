import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";

import moment from "moment";
import FormattedDate from "../../../components/Formating/FormattedDate";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";
class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: "",
      currentDate: "",
      rangeTime: [],
    };
  }
  componentDidMount() {
    this.props.getAllDoctors();
    this.props.fetchAllScheduleTime();
    this.handleDoctor();
  }
  handleDoctor = () => {
    let doctor = this.props.user;
    let { language } = this.props;
    let result = [];
    if (doctor.errCode === 0 && !_.isEmpty(doctor.userData)) {
      if (doctor.userData.roleId === "R2") {
        let object = {};
        let labelVi = `${doctor.userData.lastName} ${doctor.userData.firstName}`;
        let labelEn = `${doctor.userData.firstName} ${doctor.userData.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = doctor.userData.id;
        result.push(object);
      }
      this.setState({
        selectedDoctor: result[0],
      });
    }
  };
  handleChange = async (selectedDoctor) => {
    this.setState({ selectedDoctor });
  };
  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelName = `${item.lastName} ${item.firstName}`;
        object.label = labelName;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
    }
  }
  handleClickBtnTime = (time) => {
    console.log("jame chekc time", time);
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };
  handleOnChangeDataPicker = (date) => {
    this.setState({ currentDate: date[0] });
    console.log("check date", date[0]);
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;

    let result = [];
    if (!selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Vui lòng chọn bác sĩ!");
      return;
    }
    if (!currentDate) {
      toast.error("Vui lòng chọn ngày!");
      return;
    }

    // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    let formatedDate = new Date(currentDate).getTime();
    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((item) => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatedDate;
          object.timeType = item.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Vui lòng chọn thời giam khám bệnh!");
        return;
      }
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formatedDate: formatedDate,
    });
    if (res && res.errCode === 0) {
      toast.success("Thành công!");
    } else {
      toast.error("Thất bại!");
    }
  };
  render() {
    let { selectedDoctor, rangeTime } = this.state;
    let { user } = this.props;

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div
              className={
                user && user.userData && user.userData.roleId === "R2"
                  ? "col-6 none"
                  : "col-6"
              }
            >
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />:
              </label>
              <Select
                value={selectedDoctor}
                onChange={this.handleChange}
                options={this.state.listDoctors}
                placeholder="Chọn bác sĩ"
              />
            </div>
            <div className="col-6">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />:
              </label>
              <DatePicker
                onChange={this.handleOnChangeDataPicker}
                className="form-control"
                value={this.state.currentDate}
                // minDate={yesterday}
                minDate={new Date().setHours(0, 0, 0, 0)}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {item.value}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctors: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
