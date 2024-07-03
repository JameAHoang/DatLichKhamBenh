import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./ModalCreateSpecialty.scss";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import { CreateSpecialty } from "../../../services/specialtyService";
import { toast } from "react-toastify";

class ModalCreateSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameSpecialty: "",
      image: "",
      codeSpecialty: "",
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleOnChangeInput = (e, id) => {
    let valueInput = e.target.value;
    let copyState = { ...this.state };
    copyState[id] = valueInput;
    this.setState({
      ...copyState,
    });
  };
  clearInput = () => {
    this.setState({
      nameSpecialty: "",
      image: "",
      codeSpecialty: "",
    });
  };
  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        image: base64,
      });
    }
  };
  openPreviewImage = () => {
    // if (!this.state.previewImgURL) return;
    this.setState({ isOpen: true });
  };
  toggle = () => {
    this.props.CloseModal();
  };
  validate = (data) => {
    if (data.codeSpecialty === "") {
      toast.error("Vui lòng nhập mã chuyên khoa!");
      return false;
    }
    if (data.nameSpecialty === "") {
      toast.error("Vui lòng nhập tên chuyên khoa!");
      return false;
    }
    if (data.image === "") {
      toast.error("Vui lòng chọn ảnh chuyên khoa!");
      return false;
    }
    return true;
  };
  handleCreateSpecialty = async () => {
    let check = this.validate(this.state);
    if (check === false) {
      return;
    } else {
      this.props.createNewSpecialty(this.state);
      this.clearInput();
    }

    // let code = this.state.codeSpecialty;
    // let codetoUpperCase = code.toUpperCase();

    // let res = await CreateSpecialty({
    //   code: codetoUpperCase,
    //   name: this.state.nameSpecialty,
    //   image: this.state.image,
    // });
    // if (res && res.errCode === 0) {
    //   toast.success("Create a new specialty succeed!");
    //   this.props.CloseModal();
    // } else {
    //   toast.error("Create a new specialty error!", res.errMessage);
    // }
  };
  render() {
    let { language } = this.props;
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={() => this.toggle()}
          size="lg"
          centered
          className={"modal-specialty-container"}
        >
          <div className="modal-specialty-content">
            <div className="modal-specialty-header">Thêm mới chuyên khoa</div>
            <div className="modal-specialty-body">
              <div className="row">
                <div className="col-6 form group">
                  <label>Mã chuyên khoa</label>
                  <input
                    className="form-control"
                    value={this.state.codeSpecialty}
                    onChange={(e) =>
                      this.handleOnChangeInput(e, "codeSpecialty")
                    }
                  />
                </div>
                <div className="col-6 form group">
                  <label>Tên chuyên khoa</label>
                  <input
                    className="form-control"
                    value={this.state.nameSpecialty}
                    onChange={(e) =>
                      this.handleOnChangeInput(e, "nameSpecialty")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label htmlFor="inputAddress" className="form-label">
                    Ảnh chuyên khoa
                  </label>
                  <div className="preview-img-container">
                    <input
                      type="file"
                      id="previewImg"
                      onChange={(event) => {
                        this.handleOnChangeImage(event);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-specialty-footer">
              <button
                className="btn-specialty-confirm"
                onClick={() => this.handleCreateSpecialty()}
              >
                Xác nhận
              </button>
              <button
                className="btn-specialty-cancel"
                onClick={() => this.toggle()}
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalCreateSpecialty);
