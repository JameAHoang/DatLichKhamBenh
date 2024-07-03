import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";

import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img from "../../../assets/medical-facility/lo-go-viet-duc.jpg";
import { FormattedMessage } from "react-intl";
class Clinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinic: "",
    };
  }
  componentDidMount() {
    this.props.getAllClinic();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.listClinic !== prevProps.listClinic) {
      this.setState({
        dataClinic: this.props.listClinic,
      });
    }
  }
  handleDetailClinic = (data) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${data.id}`);
    }
  };
  handleToClinic = () => {
    this.props.history.push(`/clinic`);
  };
  render() {
    let { dataClinic } = this.state;
    console.log("check state", this.state.dataClinic);
    return (
      <>
        <div className="section section-medical-facility">
          <div className="section-content">
            <div className="section-header">
              <span className="title-section">Cơ sở y tế</span>
              <button
                className="btn-section"
                onClick={() => this.handleToClinic()}
              >
                <FormattedMessage id="homepage.search" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataClinic &&
                  dataClinic.length > 0 &&
                  dataClinic.map((item, index) => {
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
                          this.handleDetailClinic(item);
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
    language: state.app.language,
    listClinic: state.clinic.clinics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllClinic: () => dispatch(actions.fetchAllClinic()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Clinic));
