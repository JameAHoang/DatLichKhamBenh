import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";

import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img from "../../../assets/handbook/180320-bac-si-ho-hap-gioi-ha-noi-thanh-ngoc-tien-25.png";
class HandBook extends Component {
  render() {
    return (
      <>
        <div className="section section-handbook">
          <div className="section-content">
            <div className="section-header">
              <span className="title-section">Cẩm nang</span>
              <button className="btn-section">TẤT CẢ BÀI VIẾT</button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 1
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 2
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 3
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 4
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 5
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 6
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 7
                  </div>
                </div>
                <div className="section-customize">
                  <img src={img} className="bg-img" alt="" />
                  <div className="text">
                    Review khám da liễu tại BV Đại học Y Dược HN 8
                  </div>
                </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
