import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { CommonUtils } from "../../../utils";

import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import ModalCreateClinic from "./ModalCreateClinic";
import {
  createClinic,
  deleteClinic,
  editClinic,
  searchClinic,
} from "../../../services/clinicService";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import ModalEditClinic from "./ModalEditClinic";

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      isOpen: false,
      dataClinic: {},
      listClinic: [],
      isEdit: false,
    };
  }
  componentDidMount() {
    this.props.getAllClinic();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (prevProps.listClinic !== this.props.listClinic) {
      this.setState({
        listClinic: this.props.listClinic,
      });
    }
  }
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
      isEdit: false,
    });
  };
  previewImgURL = (imageBase64) => {
    if (!imageBase64) {
      this.setState({
        previewImgURL: "",
        isOpen: true,
      });
    } else {
      let blob = CommonUtils.b64toBlob(imageBase64);
      let objectUrl = URL.createObjectURL(blob);
      this.setState({
        previewImgURL: objectUrl,
        isOpen: true,
      });
    }
  };
  createNewClinic = async (data) => {
    let code = data.codeClinic;
    let codetoUpperCase = code.toUpperCase();
    let res = await createClinic({
      code: codetoUpperCase,
      name: data.nameClinic,
      address: data.addressClinic,
      image: data.image,
    });
    if (res && res.errCode === 0) {
      toast.success("Thêm mới thông tin thành công!");
      this.props.getAllClinic();
      this.setState({
        isOpenModal: false,
      });
    } else {
      toast.error("Thêm mới thông tin thất bại!");
    }
  };
  handleDelete = async (data) => {
    console.log("check delete", data);
    let id = data.id;
    let res = await deleteClinic(id);
    if (res && res.errCode === 0) {
      toast.success("Xóa thông tin thành công!");
      this.props.getAllClinic();
    } else {
      toast.error("Xóa thông tin thất bại!");
    }
  };

  handleEdit = (data) => {
    this.setState({
      isEdit: true,
      dataClinic: data,
    });
  };
  handleEditClinic = async (data) => {
    console.log("check data", data);
    let codeData = data.codeClinic;
    let codetoUpperCase = codeData.toUpperCase();
    let res = await editClinic({
      id: data.id,
      name: data.nameClinic,
      address: data.addressClinic,
      code: codetoUpperCase,
      image: data.image,
    });
    if (res && res.errCode === 0) {
      toast.success("Sửa thông tin thành công!");
      this.props.getAllClinic();
      this.CloseModalEdit();
    } else {
      toast.error("Sửa thông tin thất bại!");
    }
  };
  handleOnChangeInput = async (e) => {
    let res = await searchClinic(e.target.value);
    if (res?.errCode === 0) {
      this.setState({
        listClinic: res?.data,
      });
    }
  };
  render() {
    let { listClinic } = this.state;
    return (
      <>
        <div className="manage-clinic-container container">
          <div className="mc-title">Quản lý cơ sở y tế</div>
          <div className="search">
            <div className="btn-add-new-clinic">
              <button
                className="btn btn-primary"
                onClick={() => this.handleOpenModal()}
              >
                Thêm mới
              </button>
            </div>
            <div className="searchClinic">
              <input
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e)}
                placeholder="Tìm kiếm"
              />
            </div>
          </div>

          {this.state.isOpenModal && (
            <ModalCreateClinic
              isOpen={this.state.isOpenModal}
              CloseModal={this.CloseModal}
              createNewClinic={this.createNewClinic}
            />
          )}
          {this.state.isEdit && (
            <ModalEditClinic
              isOpen={this.state.isEdit}
              CloseModal={this.CloseModalEdit}
              dataClinic={this.state.dataClinic}
              editClinic={this.handleEditClinic}
            />
          )}
          <div className="all-clinic">
            <table id="customers">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã phòng khám</th>
                  <th>Tên phòng khám</th>
                  <th>Địa chỉ phòng khám</th>
                  <th>Ảnh phòng khám</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listClinic &&
                  listClinic.map((res, index) => {
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
                        <td>{res.address}</td>
                        <td>
                          <img
                            src={imageBase64}
                            className="img-clinic"
                            alt=""
                            onClick={() => this.previewImgURL(imageBase64)}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => this.handleEdit(res)}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => this.handleDelete(res)}
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
    listClinic: state.clinic.clinics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllClinic: () => dispatch(actions.fetchAllClinic()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
