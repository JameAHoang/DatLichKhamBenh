import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailDoctor.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { getDetailDoctorService } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtrainfor from "./DoctorExtrainfor";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detaiDoctor: {},
      currentDoctorId: -1,
    };
  }
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentDoctorId: id,
      });
      let res = await getDetailDoctorService(id);
      if (res && res.errCode === 0) {
        this.setState({
          detaiDoctor: res.data,
        });
      }
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { detaiDoctor } = this.state;
    let { language } = this.props;
    // console.log("check state", detaiDoctor);
    let name = "";

    if (detaiDoctor && detaiDoctor.positionData) {
      name = `${detaiDoctor.positionData.value}, ${detaiDoctor.lastName} ${detaiDoctor.firstName}`;
    }

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  detaiDoctor && detaiDoctor.image ? detaiDoctor.image : ""
                })`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">{name}</div>
              <div className="down">
                {detaiDoctor.Doctor_Infor &&
                  detaiDoctor.Doctor_Infor.description && (
                    <span>{detaiDoctor.Doctor_Infor.description}</span>
                  )}
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorIdFromParent={this.state.currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtrainfor
                doctorIdFromParent={this.state.currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {detaiDoctor &&
              detaiDoctor.Markdown &&
              detaiDoctor.Markdown.contentHTML && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: detaiDoctor.Markdown.contentHTML,
                  }}
                ></div>
              )}
          </div>
          <div className="comment-doctor"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
