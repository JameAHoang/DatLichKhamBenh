import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { USER_ROLE } from "../../utils";

import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import InforModal from "./InforModal";
import { getAllUsers } from "../../services/userService";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
      inforUser: [],
      isOpen: false,
    };
  }
  handleChangeLanguage = (language) => {
    this.props.changeLanguageRedux(language);
  };
  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    if (userInfo && userInfo.userData) {
      let role = userInfo.userData.roleId;
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
    }
    this.setState({
      menuApp: menu,
    });
  }
  handleLogout = () => {
    this.props.processLogout();
    this.props.history.push("/login");
  };
  handleInfor = async () => {
    let { userInfo } = this.props;
    let id = userInfo?.userData?.id;
    console.log("check data", id);
    let res = await getAllUsers(id);
    if (res?.errCode === 0) {
      let imageBase64 = "";
      if (res?.users?.image) {
        imageBase64 = new Buffer(res?.users?.image, "base64").toString(
          "binary"
        );
      }
      this.setState({
        inforUser: {
          ...res?.users,
          image: imageBase64,
        },
        isOpen: true,
      });
    }
  };
  handleCloseModal = () => {
    this.setState({
      isOpen: false,
    });
  };
  render() {
    const { userInfo } = this.props;
    const { isOpen, inforUser } = this.state;
    const fullname =
      userInfo.userData.lastName + " " + userInfo.userData.firstName;
    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>

        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />,{" "}
            {userInfo ? userInfo?.userData?.roleData?.value : ""} !
          </span>
          {/* <span
            className={
              language === LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VN
          </span>
          <span
            className={
              language === LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN
            
          </span> */}
          <span className="infor" onClick={() => this.handleInfor()}>
            Thông tin cá nhân
          </span>
          {isOpen && (
            <InforModal
              isOpen={isOpen}
              dataUser={inforUser}
              handleCloseModal={this.handleCloseModal}
            />
          )}

          {/* nút logout */}
          <div className="btn btn-logout" onClick={() => this.handleLogout()}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
    // language: state.language.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
