import React, { Component } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { FormattedMessage } from "react-intl";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom";
class DefaultClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }
  async componentDidMount() {
    let data = await this.getInforDoctor(this.props.doctorId);
    this.setState({
      dataProfile: data,
    });
  }
  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.doctorId !== prevProps.doctorId) {
      let data = await this.getInforDoctor(this.props.doctorId);
      this.setState({
        dataProfile: data,
      });
      console.log("check thay doi", this.props.doctorId);
    }
  }
  renderTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time = dataTime.timeTypeData.value;

      let date =
        language === LANGUAGES.VI
          ? moment(new Date(dataTime.date)).format("dddd - DD/MM/YYYY")
          : moment(new Date(dataTime.date))
              .locale("en")
              .format("ddd - DD/MM/YYYY");

      return (
        <>
          <div>
            {time} - {this.capitalizeFirstLetter(date)}
          </div>
          <div>Miễn phí đặt lịch</div>
        </>
      );
    }
    return <></>;
  };
  render() {
    let {
      language,
      isShow,
      dataTime,
      isShowLinkDetail,
      isShowPrice,
      doctorId,
    } = this.props;
    let { dataProfile } = this.state;
    let name = "";

    if (dataProfile && dataProfile.positionData) {
      name = `${dataProfile.positionData.value}, ${dataProfile.lastName} ${dataProfile.firstName}`;
    }
    console.log("checkk data profile", dataProfile);

    return (
      <>
        <div className="profile-doctor-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  dataProfile && dataProfile.image ? dataProfile.image : ""
                })`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">{name}</div>
              <div className="down">
                {isShow === true ? (
                  <>
                    {dataProfile.Doctor_Infor &&
                      dataProfile.Doctor_Infor.description && (
                        <span>{dataProfile.Doctor_Infor.description}</span>
                      )}
                  </>
                ) : (
                  <>{this.renderTimeBooking(dataTime)}</>
                )}
              </div>
            </div>
          </div>
          {isShowLinkDetail === true && (
            <div className="view-detail-doctor">
              <Link to={`/detail-doctor/${doctorId}`} className="see-more">
                Xem thêm
              </Link>
            </div>
          )}
          {isShowPrice === true && (
            <div className="price">
              Giá khám:{" "}
              {dataProfile && dataProfile.Doctor_Infor && (
                <NumberFormat
                  className="currency"
                  value={dataProfile.Doctor_Infor.priceTypeData.value}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"VNĐ"}
                />
              )}
            </div>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
