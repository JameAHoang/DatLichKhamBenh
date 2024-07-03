import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtrainfor from "../Doctor/DoctorExtrainfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getDetailSpecialtyDoctorLocation } from "../../../services/specialtyService";
import _ from "lodash";
import { getAllCodeService } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailSpecialty: {},
      listProvince: [],
    };
  }
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailSpecialtyDoctorLocation(id, "ALL");
      let resProvince = await getAllCodeService("province");

      if (
        res &&
        res.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0
      ) {
        if (res.data && !_.isEmpty(res.data)) {
          let arr = res.data.doctorSpecialty;
          let arrDoctorId = [];
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
          this.setState({
            arrDoctorId: arrDoctorId,
          });
        }
        let dataProvince = resProvince.data;
        if (dataProvince && dataProvince.length > 0) {
          dataProvince.unshift({
            createAt: null,
            keyMap: "ALL",
            type: "PROVINCE",
            value: "Toàn quốc",
          });
        }
        this.setState({
          dataDetailSpecialty: res.data,
          listProvince: dataProvince,
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeSelect = async (e) => {
    console.log(e.target.value);
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let location = e.target.value;
      let res = await getDetailSpecialtyDoctorLocation(id, location);

      if (res && res.errCode === 0) {
        if (res.data && !_.isEmpty(res.data)) {
          let arr = res.data.doctorSpecialty;
          let arrDoctorId = [];
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
          console.log("check doctor", arrDoctorId);
          this.setState({
            arrDoctorId: arrDoctorId,
          });
        }

        this.setState({
          dataDetailSpecialty: res.data,
        });
      }
    }
  };

  render() {
    let { language } = this.props;
    let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
    return (
      <>
        <HomeHeader />
        <div className="detail-specialty-container">
          <div className="detail-specialty-body">
            <div className="description-specialty">
              <div className="ds-title">{dataDetailSpecialty.name}</div>
              {dataDetailSpecialty &&
                dataDetailSpecialty.Markdown &&
                dataDetailSpecialty.Markdown.contentHTML && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: dataDetailSpecialty.Markdown.contentHTML,
                    }}
                  ></div>
                )}
            </div>
            <div className="select-location">
              <select
                className="list-location"
                onChange={(e) => this.handleOnChangeSelect(e)}
              >
                {listProvince &&
                  listProvince.length > 0 &&
                  listProvince.map((item, index) => {
                    return (
                      <option key={index} value={item.keyMap}>
                        {item.value}
                      </option>
                    );
                  })}
              </select>
            </div>
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((item, index) => {
                return (
                  <div className="each-doctor" key={index}>
                    <div className="dt-content-left">
                      <div className="profile-doctor">
                        <ProfileDoctor
                          doctorId={item}
                          isShow={true}
                          isShowLinkDetail={true}
                          isShowPrice={false}
                          // dataTime={dataTime}
                        />
                      </div>
                    </div>
                    <div className="dt-content-right">
                      <div className="doctor-schedule">
                        <DoctorSchedule doctorIdFromParent={item} key={index} />
                      </div>
                      <div className="doctor-extra-infor">
                        <DoctorExtrainfor
                          doctorIdFromParent={item}
                          key={index}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
