import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManageUser from "./TableManageUser";
import DatePicker from "../../../components/Input/DatePicker";
import { toast } from "react-toastify";
class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      roleArr: [],
      positionArr: [],
      previewImgURL: "",
      isOpen: false,

      userEditId: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      image: "",
      birthday: "",

      action: "",
      ShowHidePosition: false,
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
      });
    }

    if (prevProps.listUsers !== this.props.listUsers) {
      let arrGenders = this.props.genderRedux;
      let arrPositions = this.props.positionRedux;
      let arrRoles = this.props.roleRedux;
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        birthday: "",
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
        // position:
        //   arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
        image: "",
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
      });
    }
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        image: base64,
      });
    }
  };

  openPreviewImage = () => {
    // if (!this.state.previewImgURL) return;
    this.setState({ isOpen: true });
  };
  handleOnChange = (e, id) => {
    if (id === "role") {
      let role = e.target.value;
      if (role === "R2") {
        let arrPositions = this.props.positionRedux;
        this.setState({
          role: role,
          ShowHidePosition: true,
          position:
            arrPositions && arrPositions.length > 0
              ? arrPositions[0].keyMap
              : "",
        });
      } else {
        this.setState({
          role: role,
          position: "",
          ShowHidePosition: false,
        });
      }
    } else {
      let copyState = { ...this.state };
      copyState[id] = e.target.value;
      this.setState({
        ...copyState,
      });
      // console.log(copyState);
    }
  };

  validate = (data) => {
    if (data.email === "") {
      toast.error("Vui lòng nhập email!");
      return false;
    }
    if (data.password === "") {
      toast.error("Vui lòng nhập mật khẩu!");
      return false;
    }
    if (data.firstName === "") {
      toast.error("Vui lòng nhập tên!");
      return false;
    }
    if (data.lastName === "") {
      toast.error("Vui lòng nhập họ!");
      return false;
    }
    if (data.birthday === "") {
      toast.error("Vui lòng nhập ngày sinh!");
      return false;
    }
    if (data.phoneNumber === "") {
      toast.error("Vui lòng nhập số điện thoại!");
      return false;
    }
    if (data.address === "") {
      toast.error("Vui lòng nhập địa chỉ!");
      return false;
    }
    if (data.gender === "") {
      toast.error("Vui lòng nhập giới tính!");
      return false;
    }
    if (data.roleId === "") {
      toast.error("Vui lòng nhập vai trò!");
      return false;
    }
    return true;
  };

  handleSaveUser = () => {
    let email = this.state.email;
    let arrUsers = this.props.listUsers;

    let isValid = this.validate(this.state);
    if (isValid === false) return;

    let { action } = this.state;
    if (action === CRUD_ACTIONS.EDIT) {
      this.props.editAUser({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        image: this.state.image,
        birthday: this.state.birthday,
      });
      this.clearInput();
    } else {
      //check email tồn tại
      for (let i = 0; i < arrUsers.length; i++) {
        if (arrUsers[i].email === email) {
          toast.error("Email đã tồn tại");
          return;
        }
      }
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        image: this.state.image,
        birthday: this.state.birthday,
      });
      this.props.fetchUsers();
      this.clearInput();
    }
  };
  clearInput = () => {
    let arrGenders = this.props.genderRedux;
    let arrRoles = this.props.roleRedux;
    this.setState({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      birthday: "",
      gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
      role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
      position: "",
      image: "",
      action: CRUD_ACTIONS.CREATE,
      previewImgURL: "",
      ShowHidePosition: false,
    });
  };
  handleOnChangeDataPicker = (date) => {
    this.setState({ birthday: date[0] });
  };
  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    if (user && user.roleId === "R2") {
      this.setState({
        email: user.email,
        password: "HARDCODE",
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phonenumber,
        birthday: user.birthday,
        address: user.address,
        gender: user.gender,
        position: user.positionId,
        role: user.roleId,
        image: "",
        previewImgURL: imageBase64,
        action: CRUD_ACTIONS.EDIT,
        userEditId: user.id,
        ShowHidePosition: true,
      });
    } else {
      this.setState({
        email: user.email,
        password: "HARDCODE",
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phonenumber,
        birthday: user.birthday,
        address: user.address,
        gender: user.gender,
        position: user.positionId,
        role: user.roleId,
        image: "",
        previewImgURL: imageBase64,
        action: CRUD_ACTIONS.EDIT,
        userEditId: user.id,
        ShowHidePosition: false,
      });
    }
  };

  render() {
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;
    let language = this.props.language;

    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      position,
      role,
      gender,
      birthday,
      action,
    } = this.state;
    return (
      <>
        <div className="text-center title-user">
          {action === CRUD_ACTIONS.EDIT
            ? "Sửa thông tin người dùng"
            : "Thêm mới người dùng"}
        </div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <form className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="inputEmail4" className="form-label">
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => this.handleOnChange(e, "email")}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputPassword4" className="form-label">
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => this.handleOnChange(e, "password")}
                    disabled={
                      this.state.action === CRUD_ACTIONS.EDIT ? true : false
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputEmail4" className="form-label">
                    <FormattedMessage id="manage-user.first-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => this.handleOnChange(e, "firstName")}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputEmail4" className="form-label">
                    <FormattedMessage id="manage-user.last-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => this.handleOnChange(e, "lastName")}
                  />
                </div>

                <div className="col-3">
                  <label className="form-label">Ngày sinh</label>
                  <DatePicker
                    onChange={this.handleOnChangeDataPicker}
                    className="form-control"
                    value={birthday}
                    // minDate={yesterday}
                  />
                </div>
                <div className="col-3">
                  <label htmlFor="inputAddress" className="form-label">
                    <FormattedMessage id="manage-user.phone-number" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => this.handleOnChange(e, "phoneNumber")}
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="inputAddress" className="form-label">
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => this.handleOnChange(e, "address")}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    id="inputState"
                    className="form-select"
                    onChange={(e) => this.handleOnChange(e, "gender")}
                    value={gender}
                  >
                    {genders &&
                      genders.length > 0 &&
                      genders.map((item, index) => {
                        return (
                          <option key={index} value={item.keyMap}>
                            {item.value}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">
                    <FormattedMessage id="manage-user.role" />
                  </label>
                  <select
                    id="inputState"
                    className="form-select"
                    onChange={(e) => this.handleOnChange(e, "role")}
                    value={role}
                  >
                    {roles &&
                      roles.length > 0 &&
                      roles.map((item, index) => {
                        return (
                          <option key={index} value={item.keyMap}>
                            {item.value}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div
                  className={
                    this.state.ShowHidePosition === true
                      ? "col-md-3"
                      : "col-md-3 none"
                  }
                >
                  <label htmlFor="inputState" className="form-label">
                    <FormattedMessage id="manage-user.position" />
                  </label>
                  <select
                    id="inputState"
                    className="form-select"
                    onChange={(e) => this.handleOnChange(e, "position")}
                    value={position}
                  >
                    {positions &&
                      positions.length > 0 &&
                      positions.map((item, index) => {
                        return (
                          <option key={index} value={item.keyMap}>
                            {item.value}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="col-3">
                  <label htmlFor="inputAddress" className="form-label">
                    <FormattedMessage id="manage-user.image" />
                  </label>
                  <div className="preview-img-container">
                    <input
                      type="file"
                      id="previewImg"
                      hidden
                      onChange={(event) => {
                        this.handleOnChangeImage(event);
                      }}
                    />
                    <div className="upload">
                      <label htmlFor="previewImg" className="label-upload">
                        <FormattedMessage id="manage-user.upload" />{" "}
                        <i className="fas fa-upload"></i>
                      </label>
                    </div>
                    <div
                      className="preview-image"
                      style={{
                        backgroundImage: `url(${this.state.previewImgURL})`,
                      }}
                      onClick={() => this.openPreviewImage()}
                    ></div>
                  </div>
                </div>
                <div className="col-12 my-3 mt-2 btn-user">
                  <button
                    type="button"
                    className={
                      action === CRUD_ACTIONS.EDIT
                        ? "btn btn-warning"
                        : "btn btn-primary"
                    }
                    onClick={() => this.handleSaveUser()}
                  >
                    {action === CRUD_ACTIONS.EDIT
                      ? "Lưu thông tin"
                      : "Tạo thông tin"}
                  </button>
                  {action === CRUD_ACTIONS.EDIT && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => this.clearInput()}
                    >
                      Hủy
                    </button>
                  )}
                </div>

                <div className="col-12 mb-5">
                  <TableManageUser
                    handleEditUserFromParent={this.handleEditUserFromParent}
                    action={this.state.action}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUsers: () => dispatch(actions.fetchAllUsersStart()),
    editAUser: (data) => dispatch(actions.editAUserStart(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
