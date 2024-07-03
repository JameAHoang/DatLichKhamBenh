import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./ModalEditClinic.scss";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";

import { toast } from "react-toastify";

class ModalEditClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      codeClinic: "",
      nameClinic: "",
      addressClinic: "",
      id: "",
    };
  }
  async componentDidMount() {
    await this.loadData();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  loadData = () => {
    let { dataClinic } = this.props;
    console.log("check load data", dataClinic);
    if (dataClinic && dataClinic.image && dataClinic.image.data) {
      let imageBase64 = new Buffer(dataClinic.image.data, "base64").toString(
        "binary"
      );
      this.setState({
        codeClinic: dataClinic.code,
        nameClinic: dataClinic.name,
        addressClinic: dataClinic.address,
        image: imageBase64,
        id: dataClinic.id,
      });
    }
  };
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
  handleEditClinic = async () => {
    this.props.editClinic(this.state);
  };

  render() {
    let { language } = this.props;
    console.log("check props", this.props.dataClinic);
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
            <div className="modal-clinic-header">Sửa thông tin phòng khám</div>
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
                onClick={() => this.handleEditClinic()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditClinic);
