import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./ModalEditSpecialty.scss";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import { CreateSpecialty } from "../../../services/specialtyService";
import { toast } from "react-toastify";

class ModalEditSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameSpecialty: "",
      image: "",
      codeSpecialty: "",
      id: "",
    };
  }
  componentDidMount() {
    this.getDataEdit();
  }
  getDataEdit = () => {
    let { dataSpecialty } = this.props;
    if (dataSpecialty && dataSpecialty.image && dataSpecialty.image.data) {
      let imageBase64 = new Buffer(dataSpecialty.image.data, "base64").toString(
        "binary"
      );
      this.setState({
        nameSpecialty: dataSpecialty.name,
        codeSpecialty: dataSpecialty.code,
        image: imageBase64,
        id: dataSpecialty.id,
      });
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.dataSpecialty !== prevProps.dataSpecialty) {
      this.getDataEdit();
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
  toggle = () => {
    this.props.CloseModal();
  };
  handleEditSpecialty = () => {
    this.props.editSpecialty(this.state);
  };
  //
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
            <div className="modal-specialty-header">Sửa chuyên khoa</div>
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
                onClick={() => this.handleEditSpecialty()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditSpecialty);
