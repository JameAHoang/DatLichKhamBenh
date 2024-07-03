import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";

import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import secialtyImg from "../../../assets/specialty/co-xuong-khop.jpg";
class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: "",
    };
  }
  componentDidMount() {
    this.props.getAllSpecialty();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.allSpecialty !== prevProps.allSpecialty) {
      this.setState({
        dataSpecialty: this.props.allSpecialty,
      });
    }
  }
  handleDetailSpecialty = (data) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${data.id}`);
    }
  };
  handleToSpecialty = () => {
    this.props.history.push(`/specialty`);
  };
  render() {
    let { dataSpecialty } = this.state;
    console.log("check data", dataSpecialty);
    return (
      <>
        <div className="section section-specialty">
          <div className="section-content">
            <div className="section-header">
              <span className="title-section">Chuyên khoa </span>
              <button
                className="btn-section"
                onClick={() => this.handleToSpecialty()}
              >
                {" "}
                <FormattedMessage id="homepage.more-infor" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataSpecialty &&
                  dataSpecialty.length > 0 &&
                  dataSpecialty.map((item, index) => {
                    let imageBase64 = "";
                    if (item.image) {
                      imageBase64 = new Buffer(item.image, "base64").toString(
                        "binary"
                      );
                    }
                    return (
                      <div
                        className="section-customize"
                        key={index}
                        onClick={() => {
                          this.handleDetailSpecialty(item);
                        }}
                      >
                        <img src={imageBase64} className="bg-img" alt="" />
                        <div className="text">{item.name}</div>
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
    allSpecialty: state.specialty.specialties,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllSpecialty: () => dispatch(actions.fetchAllSpecialty()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
