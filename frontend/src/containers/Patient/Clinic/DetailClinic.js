import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtrainfor from "../Doctor/DoctorExtrainfor";
import {
  getDetailClinicById,
  getDetailClinicDoctorById,
} from "../../../services/clinicService";
import _ from "lodash";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailClinic: {},
    };
  }
  async componentDidMount() {
    this.getDetailClinicById();
    this.getDetailClinicDoctorById();
  }
  getDetailClinicById = async () => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailClinicById(id);
      if (res && res.errCode === 0) {
        this.setState({
          dataDetailClinic: res.data,
        });
      }
    }
  };
  getDetailClinicDoctorById = async () => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailClinicDoctorById(id);
      if (res && res.errCode === 0) {
        if (res.data && !_.isEmpty(res.data)) {
          let arr = res.data;
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
      }
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    let { language } = this.props;
    let { arrDoctorId, dataDetailClinic } = this.state;
    console.log("check state", dataDetailClinic);
    return (
      <>
        <HomeHeader />
        <div className="detail-clinic-container">
          <div className="detail-clinic-body">
            <div className="description-clinic">
              <div className="ds-title">{dataDetailClinic.name}</div>
              {dataDetailClinic && dataDetailClinic.contentHTML && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataDetailClinic.contentHTML,
                  }}
                ></div>
              )}
            </div>
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((item, index) => {
                return (
                  <div className="each-doctor">
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
