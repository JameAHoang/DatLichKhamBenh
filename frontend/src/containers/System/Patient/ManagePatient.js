import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl";
import {
  deletePatient,
  getAllPatients,
  searchPatients,
} from "../../../services/patientService";
import moment from "moment";
import ModalPatient from "./ModalPatient";
import { toast } from "react-toastify";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPatients: [],
      isOpen: false,
      Patient: {},
    };
  }
  componentDidMount() {
    this.handleGetAllPatients();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleGetAllPatients = async () => {
    let res = await getAllPatients();
    if (res?.errCode === 0) {
      this.setState({
        listPatients: res?.data?.rows,
      });
    }
  };
  handleOnChangeInput = async (e) => {
    let res = await searchPatients(e.target.value);
    console.log("check data", res);
    if (res?.errCode === 0) {
      this.setState({
        listPatients: res?.data,
      });
    }
  };
  handleEditPatient = (data) => {
    this.setState({
      isOpen: true,
      Patient: data,
    });
  };
  handleDeletePatient = async (id) => {
    let res = await deletePatient({ id });
    if (res?.errCode === 0) {
      toast.success("Thành công!");
      this.handleGetAllPatients();
    } else {
      toast.error("Thất bại");
    }
  };
  handleCloseModal = () => {
    this.setState({
      isOpen: false,
    });
  };
  render() {
    let { language } = this.props;
    let { listPatients, isOpen, Patient } = this.state;
    console.log("check data patient", listPatients);
    return (
      <>
        <div className="manage-patient-container container">
          {isOpen && (
            <ModalPatient
              isOpen={isOpen}
              Patient={Patient}
              handleCloseModal={this.handleCloseModal}
              handleGetAllPatients={this.handleGetAllPatients}
            />
          )}

          <div className="mc-title">Quản lý bệnh nhân</div>
          <div className="searchPatient">
            <input
              className="form-control"
              onChange={(e) => this.handleOnChangeInput(e)}
              placeholder="Tìm kiếm"
            />
          </div>
          <div className="all-patient">
            <table id="customers">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã bệnh nhân</th>
                  <th>Họ và tên</th>
                  <th>Giới tính</th>
                  <th>Năm sinh</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listPatients && listPatients.length > 0 ? (
                  listPatients.map((res, index) => {
                    let day = moment.utc(res.birthday).format("DD");
                    let month = moment.utc(res.birthday).format("MM");
                    let year = moment.utc(res.birthday).format("YYYY");
                    let birthday = Number(day) + 1 + "/" + month + "/" + year;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{res.id}</td>
                        <td>{res.lastName + " " + res.firstName}</td>
                        <td>{res.genderDataPatient.value}</td>
                        <td>{birthday}</td>
                        <td>{res.phoneNumber}</td>
                        <td>{res.address}</td>
                        <td>
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => this.handleEditPatient(res)}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button
                            type="button"
                            className="btn-delete"
                            onClick={() => this.handleDeletePatient(res.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Không có dữ liệu bệnh nhân
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
