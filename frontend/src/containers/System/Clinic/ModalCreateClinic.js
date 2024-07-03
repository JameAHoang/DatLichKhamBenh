import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./ModalCreateClinic.scss";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import { CreateSpecialty } from "../../../services/specialtyService";
import { toast } from "react-toastify";

class ModalCreateCinlic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      codeClinic: "",
      nameClinic: "",
      addressClinic: "",
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
      nameClinic: "",
      image: "",
      codeClinic: "",
      addressClinic: "",
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

  toggle = () => {
    this.props.CloseModal();
  };
  validate = (data) => {
    if (data.codeClinic === "") {
      toast.error("Vui lòng nhập mã phòng khám!");
      return false;
    }
    if (data.nameClinic === "") {
      toast.error("Vui lòng nhập tên phòng khám!");
      return false;
    }
    if (data.addressClinic === "") {
      toast.error("Vui lòng nhập địa chỉ phòng khám!");
      return false;
    }
    if (data.image === "") {
      toast.error("Vui lòng chọn ảnh phòng khám!");
      return false;
    }
    return true;
  };
  handleCreateClinic = async () => {
    let check = this.validate(this.state);
    if (check === false) {
      return;
    } else {
      this.props.createNewClinic(this.state);
      this.clearInput();
    }
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
          className={"modal-clinic-container"}
        >
          <div className="modal-clinic-content">
            <div className="modal-clinic-header">Thêm mới phòng khám</div>
            <div className="modal-clinic-body">
              <div className="row">
                <div className="col-6 form group">
                  <label>Mã phòng khám</label>
                  <input
                    className="form-control"
                    value={this.state.codeClinic}
                    onChange={(e) => this.handleOnChangeInput(e, "codeClinic")}
                  />
                </div>
                <div className="col-6 form group">
                  <label>Tên phòng khám</label>
                  <input
                    className="form-control"
                    value={this.state.nameClinic}
                    onChange={(e) => this.handleOnChangeInput(e, "nameClinic")}
                  />
                </div>
                <div className="col-6 form group">
                  <label>Địa chỉ phòng khám</label>
                  <input
                    className="form-control"
                    value={this.state.addressClinic}
                    onChange={(e) =>
                      this.handleOnChangeInput(e, "addressClinic")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label htmlFor="inputAddress" className="form-label">
                    Ảnh phòng khám
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
            <div className="modal-clinic-footer">
              <button
                className="btn-clinic-confirm"
                onClick={() => this.handleCreateClinic()}
              >
                Xác nhận
              </button>
              <button
                className="btn-clinic-cancel"
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateCinlic);
