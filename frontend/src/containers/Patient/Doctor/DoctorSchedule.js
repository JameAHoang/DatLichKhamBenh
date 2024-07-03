import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
import { getScheduleByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
import localization from "moment/locale/vi";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvalabletime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }
  async componentDidMount() {
    let { language } = this.props;

    // console.log("moment vie: ", moment(new Date()).format("dddd- DD/MM"));
    // console.log(
    //   "moment en: ",
    //   moment(new Date()).locale("en").format("dddd- DD/MM")
    // );

    let allDays = this.getArrDays();
    if (allDays && allDays.length > 0) {
      let res = await getScheduleByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      console.log("check res", res);
      this.setState({
        allDays: allDays,
        allAvalabletime: res.data ? res.data : [],
      });
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    let { language } = this.props;

    if (language !== prevProps.language) {
      let allDays = this.getArrDays();
      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays();
      let res = await getScheduleByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvalabletime: res.data ? res.data : [],
      });
    }
  }
  getArrDays = () => {
    let { language } = this.props;
    let arrDate = [];
    //Lặp 7 ngày tính từ ngày hôm nay // format("dddd-DD/MM") vd: thứ 2 ngày 22/02
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = this.capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("dddd - DD/MM");
        }
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      arrDate.push(object);
    }
    return arrDate;
  };
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  handleOnChangeSelect = async (e) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let date = e.target.value;
      let dateString = moment.unix(date / 1000).format("YYYY-MM-DD");

      console.log("check ", dateString);

      // let formatted = timestemp.format("dd-mm-yyyy hh:MM:ss");
      let doctorId = this.props.doctorIdFromParent;
      let res = await getScheduleByDate(doctorId, date);
      if (res && res.errCode === 0) {
        this.setState({
          allAvalabletime: res.data ? res.data : [],
        });
      }
      console.log(res, "check respon schedule doctor react");
    }
  };

  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };
  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  render() {
    let {
      allDays,
      allAvalabletime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { language } = this.props;
    console.log("check datatime", dataScheduleTimeModal);
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(e) => this.handleOnChangeSelect(e)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvalabletime && allAvalabletime.length > 0 ? (
                <>
                  <div className="time-content-btn">
                    {allAvalabletime.map((item, index) => {
                      let timeDisplay = item.timeTypeData.value;
                      return (
                        <button
                          key={index}
                          className={
                            language === LANGUAGES.VI ? "btn-vi" : "btn-en"
                          }
                          onClick={() => this.handleClickScheduleTime(item)}
                        >
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>
                  <div className="book-free">
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />{" "}
                      <i className="far fa-hand-point-up"></i>{" "}
                      <FormattedMessage id="patient.detail-doctor.book-free" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>
        {isOpenModalBooking && (
          <BookingModal
            isOpen={isOpenModalBooking}
            closeBookingModal={this.closeBookingModal}
            dataTime={dataScheduleTimeModal}
          />
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
