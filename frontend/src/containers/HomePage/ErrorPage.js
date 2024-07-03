import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import HomeHeader from "./HomeHeader";

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  returnHome = () => {
    this.props.history.push(`/home`);
  };
  render() {
    let { language } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="container">
          <div>Không thấy thông tin!</div>
          <button
            onClick={() => this.returnHome()}
            className="btn btn-secondary"
          >
            Về trang chủ
          </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
