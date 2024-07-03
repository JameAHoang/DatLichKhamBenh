import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img from "../../../assets/outstanding-doctor/114430-bshung.jpg";
import { withRouter } from "react-router";
import { getAllDoctorsAndLocationSpecialty } from "../../../services/userService";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevProps.topDoctors !== this.props.topDoctors) {
    //   this.setState({
    //     arrDoctors: this.props.topDoctors,
    //   });
    // }
  }

  async componentDidMount() {
    // this.props.loadTopDoctors();
    let res = await getAllDoctorsAndLocationSpecialty();
    console.log("check res doctorr", res);
    if (res && res.errCode === 0) {
      this.setState({
        arrDoctors: res.data,
      });
    }
  }
  handleDetailDoctor = (data) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${data.id}`);
    }
  };

  handleToDoctor = () => {
    this.props.history.push(`/search-doctor`);
  };
  render() {
    let { arrDoctors } = this.state;
    let { language } = this.props;

    return (
      <>
        <div className="section section-outstanding-doctor">
          <div className="section-content">
            <div className="section-header">
              <span className="title-section">Danh sách các bác sĩ </span>
              <button
                className="btn-section"
                onClick={() => this.handleToDoctor()}
              >
                <FormattedMessage id="homepage.search" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {arrDoctors &&
                  arrDoctors.length > 0 &&
                  arrDoctors.map((item, index) => {
                    let imageBase64 = "";
                    if (item.image) {
                      imageBase64 = new Buffer(item.image, "base64").toString(
                        "binary"
                      );
                    }

                    let name = `${item.positionData.value}, ${item.lastName} ${item.firstName}`;

                    return (
                      <div
                        className="section-customize section-customize-outstanding-doctor"
                        key={index}
                      >
                        <div
                          className="customize-border"
                          onClick={() => this.handleDetailDoctor(item)}
                        >
                          <div className="outer-bg">
                            <img
                              src={imageBase64}
                              className="img-doctor "
                              alt=""
                            />
                            <div className="text">{name}</div>
                            <div className="text1">
                              {item.Doctor_Infor.Specialty.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    // topDoctors: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
