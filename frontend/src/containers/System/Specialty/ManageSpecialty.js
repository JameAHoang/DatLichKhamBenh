import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import { FormattedMessage } from "react-intl";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import ModalCreateSpecialty from "./ModalCreateSpecialty";
import * as actions from "../../../store/actions";
import { CommonUtils } from "../../../utils";
import Lightbox from "react-image-lightbox";
import {
  CreateSpecialty,
  deleteSpecialty,
  editSpecialty,
  searchSpecialty,
} from "../../../services/specialtyService";
import { toast } from "react-toastify";
import ModalEditSpecialty from "./ModalEditSpecialty";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      isOpenModalEdit: false,
      specialties: [],
      previewImgURL: "",
      isOpenImage: false,
      specialty: {},
    };
  }
  componentDidMount() {
    this.props.getAllSpecialty();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.specialties !== prevProps.specialties) {
      this.setState({
        specialties: this.props.specialties,
      });
    }
  }
  createNewSpecialty = async (data) => {
    let code = data.codeSpecialty;
    let codetoUpperCase = code.toUpperCase();

    let res = await CreateSpecialty({
      code: codetoUpperCase,
      name: data.nameSpecialty,
      image: data.image,
    });
    if (res && res.errCode === 0) {
      toast.success("Tạo chuyên khoa thành công!");
      this.props.getAllSpecialty();
      this.setState({
        isOpenModal: false,
      });
    } else {
      toast.error("Tạo chuyên khoa thất bại!");
    }
  };
  editSpecialty = async (data) => {
    let codeData = data.codeSpecialty;
    let codetoUpperCase = codeData.toUpperCase();
    let res = await editSpecialty({
      code: codetoUpperCase,
      name: data.nameSpecialty,
      image: data.image,
      id: data.id,
    });
    if (res && res.errCode === 0) {
      toast.success("Sửa chuyên khoa thành công!");
      this.props.getAllSpecialty();
      this.setState({
        isOpenModalEdit: false,
      });
    } else {
      toast.error("Sửa chuyên khoa thất bại");
    }
  };
  handleOpenModal = () => {
    this.setState({
      isOpenModal: true,
    });
  };
  CloseModal = () => {
    this.setState({
      isOpenModal: false,
    });
  };
  CloseModalEdit = () => {
    this.setState({
      isOpenModalEdit: false,
    });
  };
  previewImgURL = (imageBase64) => {
    if (!imageBase64) {
      this.setState({
        previewImgURL: "",
        isOpenImage: true,
      });
    } else {
      let blob = CommonUtils.b64toBlob(imageBase64);
      let objectUrl = URL.createObjectURL(blob);
      this.setState({
        previewImgURL: objectUrl,
        isOpenImage: true,
      });
    }
  };
  handleDeleteSpecialty = async (data) => {
    let res = await deleteSpecialty(data.id);
    if (res && res.errCode === 0) {
      toast.success("Xóa chuyên khoa thành công!");
      this.props.getAllSpecialty();
    } else {
      toast.error("Xóa chuyên khoa thất bại!");
    }
  };
  handleEditSpecialty = (data) => {
    console.log("check edit data", data);
    if (data) {
      this.setState({
        isOpenModalEdit: true,
        specialty: data,
      });
    }
  };
  handleOnChangeInput = async (e) => {
    let res = await searchSpecialty(e.target.value);
    console.log("check data", res);
    if (res?.errCode === 0) {
      this.setState({
        specialties: res?.data,
      });
    }
  };
  render() {
    let { language } = this.props;
    let { specialties } = this.state;
    return (
      <>
        <div className="manage-specialty-container container">
          <div className="ms-title">Quản lý chuyên khoa</div>

          <div className="search">
            <div className="btn-add-new-specialty">
              <button
                className="btn btn-primary"
                onClick={() => this.handleOpenModal()}
              >
                Thêm mới
              </button>
            </div>
            <div className="searchSpecialty">
              <input
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e)}
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <ModalCreateSpecialty
            isOpen={this.state.isOpenModal}
            CloseModal={this.CloseModal}
            createNewSpecialty={this.createNewSpecialty}
          />
          <ModalEditSpecialty
            isOpen={this.state.isOpenModalEdit}
            CloseModal={this.CloseModalEdit}
            dataSpecialty={this.state.specialty}
            editSpecialty={this.editSpecialty}
          />
          <div className="all-specialty">
            <table id="customers">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã chuyên khoa</th>
                  <th>Tên chuyên khoa</th>
                  <th>Ảnh chuyên khoa</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {specialties &&
                  specialties.map((res, index) => {
                    let imageBase64 = "";
                    if (res.image) {
                      imageBase64 = new Buffer(res.image, "base64").toString(
                        "binary"
                      );
                    }
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{res.code}</td>
                        <td>{res.name}</td>
                        <td>
                          <img
                            src={imageBase64}
                            className="img-specialty"
                            alt=""
                            onClick={() => this.previewImgURL(imageBase64)}
                          />
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => this.handleEditSpecialty(res)}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => this.handleDeleteSpecialty(res)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {this.state.isOpenImage === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpenImage: false })}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    specialties: state.specialty.specialties,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllSpecialty: () => dispatch(actions.fetchAllSpecialty()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
