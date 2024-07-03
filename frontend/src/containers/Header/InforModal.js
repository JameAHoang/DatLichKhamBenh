import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import "./InforModal.scss";
import { Modal } from "reactstrap";
import DatePicker from "../../components/Input/DatePicker";
import * as actions from "../../store/actions";
import Lightbox from "react-image-lightbox";
import { CommonUtils } from "../../utils";
import { toast } from "react-toastify";
import { changePassUser } from "../../services/userService";

class InforModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genders: [],
      dataUser: this.props.dataUser,
      isOpen: false,
      isChangePass: false,
      isShowPassword: false,
    };
  }
  componentDidMount() {
    this.props.getGenderStart();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genders: arrGenders,
      });
    }
  }
  handleOnChangeDataPicker = (date) => {
    this.setState({ ...this.state.dataUser, birthday: date[0] });
  };
  toggle = () => {
    this.props.handleCloseModal();
  };
  handleOnChangeInput = (e) => {
    this.setState({
      dataUser: { ...this.state.dataUser, [e.target.name]: e.target.value },
    });
  };
  handleUpdateInforUser = async () => {
    let { isChangePass, dataUser } = this.state;
    if (isChangePass) {
      if (!dataUser.newPass) {
        toast.error("Vui lòng nhập mật khẩu mới!");
        return;
      }
      let res = await changePassUser({
        id: dataUser.id,
        password: dataUser.newPass,
      });
      if (res?.errCode === 0) {
        toast.success("Đổi mật khẩu thành công!");
        this.toggle();
      } else if (res?.errCode === 3) {
        toast.error("Mật khẩu mới trùng với mật khẩu cũ!");
      } else {
        toast.error("Thất bại!");
      }
    } else {
      this.props.editAUser(dataUser);
      this.toggle();
    }
  };
  openPreviewImage = () => {
    this.setState({
      isOpen: true,
    });
  };

  handleOnChangeImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        dataUser: {
          ...this.state.dataUser,
          image: base64,
        },
      });
    }
  };
  handleOpenChangePass = () => {
    this.setState({
      isChangePass: true,
    });
  };
  handleBackInfor = () => {
    this.setState({
      isChangePass: false,
    });
  };
  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };
  render() {
    let { isOpen } = this.props;
    let { genders, dataUser, isChangePass } = this.state;
    return (
      <>
        <Modal
          isOpen={isOpen}
          toggle={() => this.toggle()}
          size={isChangePass ? "md" : "lg"}
          centered
          className={"modal-infor-container"}
        >
          <div className="modal-infor-content">
            <div className="modal-infor-header">
              {isChangePass ? (
                <>
                  <div className="title">Đổi mật khẩu</div>
                  <div
                    className="back-infor"
                    onClick={() => this.handleBackInfor()}
                  >
                    Quay lại
                  </div>
                </>
              ) : (
                <>
                  <div className="title">Thông tin cá nhân</div>
                  <div
                    className="change-pass"
                    onClick={() => this.handleOpenChangePass()}
                  >
                    Đổi mật khẩu
                  </div>
                </>
              )}
            </div>

            <div className="modal-infor-body">
              {isChangePass ? (
                <>
                  <div className="col-12 form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      value={dataUser?.email || ""}
                      name="email"
                      disabled
                    />
                  </div>
                  <div className="col-12 form-group ">
                    <label>Mật khẩu mới</label>
                    <div className="newPass">
                      <input
                        type={this.state.isShowPassword ? "text" : "password"}
                        className="form-control"
                        onChange={(e) => this.handleOnChangeInput(e)}
                        name="newPass"
                      />
                      <span onClick={() => this.handleShowHidePassword()}>
                        <i
                          className={
                            this.state.isShowPassword
                              ? "far fa-eye"
                              : "far fa-eye-slash"
                          }
                        ></i>
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row g-3">
                    <div className="col-4 form-group">
                      <label>Họ</label>
                      <input
                        className="form-control"
                        value={dataUser?.lastName || ""}
                        onChange={(e) => this.handleOnChangeInput(e)}
                        name="lastName"
                      />
                    </div>
                    <div className="col-4 form-group">
                      <label>Tên</label>
                      <input
                        className="form-control"
                        value={dataUser?.firstName || ""}
                        onChange={(e) => this.handleOnChangeInput(e)}
                        name="firstName"
                      />
                    </div>
                    <div className="col-4 form-group">
                      <label>Số điện thoại</label>
                      <input
                        className="form-control"
                        value={dataUser?.phonenumber || ""}
                        onChange={(e) => this.handleOnChangeInput(e)}
                        name="phonenumber"
                      />
                    </div>
                    <div className="col-4 form-group">
                      <label className="form-label">Ngày sinh</label>
                      <DatePicker
                        onChange={this.handleOnChangeDataPicker}
                        className="form-control"
                        value={dataUser?.birthday}
                        // minDate={yesterday}
                      />
                    </div>
                    <div className="col-4 form-group">
                      <label htmlFor="inputState" className="form-label">
                        <FormattedMessage id="manage-user.gender" />
                      </label>
                      <select
                        id="inputState"
                        className="form-select"
                        onChange={(e) => this.handleOnChangeInput(e)}
                        value={dataUser?.gender}
                        name="gender"
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
                    <div className="col-4 form-group">
                      <label htmlFor="inputAddress" className="form-label">
                        <FormattedMessage id="manage-user.image" />
                      </label>
                      <div className="preview-img-container">
                        <input
                          type="file"
                          id="previewImg"
                          hidden
                          onChange={(e) => this.handleOnChangeImage(e)}
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
                            backgroundImage: `url(${dataUser?.image})`,
                          }}
                          onClick={() => this.openPreviewImage()}
                        ></div>
                      </div>
                    </div>
                    <div className="col-12 form-group">
                      <label>Địa chỉ</label>
                      <input
                        className="form-control"
                        value={dataUser?.address || ""}
                        onChange={(e) => this.handleOnChangeInput(e)}
                        name="address"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-infor-footer">
              <button
                className="btn-infor-confirm"
                onClick={() => this.handleUpdateInforUser()}
              >
                Xác nhận
              </button>
              <button
                className="btn-infor-cancel"
                onClick={() => this.toggle()}
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
        {/* {this.state.isOpen && (
          <Lightbox
            mainSrc={dataUser?.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )} */}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    editAUser: (data) => dispatch(actions.editAUserStart(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InforModal);
