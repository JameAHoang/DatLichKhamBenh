import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import HomeHeader from "../../../HomePage/HomeHeader";

class BookingSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  render() {
    let { language } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="verify-email-container">
          <div className="infor-booking">
            Bạn đã đặt lịch khám bệnh thành công! Vui lòng truy cập email để xác
            nhận lịch khám
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingSuccess);
