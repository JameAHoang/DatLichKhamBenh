import React, { Component } from "react";
import { connect } from "react-redux";
import "./ModalPatient.scss";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import DatePicker from "../../../components/Input/DatePicker";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { editPatient } from "../../../services/patientService";
import { toast } from "react-toastify";

class ModalPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Patient: this.props.Patient,
    };
  }
  componentDidMount() {
    this.props.getGender();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  toggle = () => {
    this.props.handleCloseModal();
  };
  handleOnChangeDataPicker = (date) => {
    this.setState({
      Patient: {
        ...this.state.Patient,
        birthday: date[0],
      },
    });
  };
  handleEditPatient = async () => {
    let res = await editPatient(this.state.Patient);
    if (res?.errCode === 0) {
      toast.success("Thành công!");
      this.toggle();
      this.props.handleGetAllPatients();
    } else {
      toast.error("Thất bại!");
    }
  };
  handleOnChangeInput = (e) => {
    this.setState({
      Patient: {
        ...this.state.Patient,
        [e.target.name]: e.target.value,
      },
    });
  };
  render() {
    let { Patient } = this.state;
    let { genders } = this.props;
    return (
      <>
        {" "}
        <Modal
          isOpen={this.props.isOpen}
          toggle={() => this.toggle()}
          size="lg"
          centered
          className={"modal-patient-container"}
        >
          <div className="modal-patient-content">
            <div className="modal-patient-header">Sửa thông tin bệnh nhân</div>
            <div className="modal-patient-body">
              <div className="row ">
                <div className="col-6 form group">
                  <label>Tên</label>
                  <input
                    className="form-control"
                    value={Patient.firstName || ""}
                    name="firstName"
                    onChange={(e) => this.handleOnChangeInput(e)}
                  />
                </div>
                <div className="col-6 form group">
                  <label>Họ</label>
                  <input
                    className="form-control"
                    value={Patient.lastName || ""}
                    name="lastName"
                    onChange={(e) => this.handleOnChangeInput(e)}
                  />
                </div>
                <div className="col-4 form group">
                  <label>Số điện thoại</label>
                  <input
                    className="form-control"
                    value={Patient.phoneNumber || ""}
                    name="phoneNumber"
                    onChange={(e) => this.handleOnChangeInput(e)}
                  />
                </div>
                <div className="col-4 form group">
                  <label>Ngày sinh</label>
                  <DatePicker
                    onChange={this.handleOnChangeDataPicker}
                    className="form-control"
                    value={Patient.birthday || ""}
                    // minDate={yesterday}
                  />
                </div>
                <div className="col-4 form group">
                  <label>
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    id="inputState"
                    className="form-select"
                    onChange={(e) => this.handleOnChangeInput(e)}
                    value={Patient.gender || ""}
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
                <div className="col-12 form group">
                  <label>Địa chỉ liên hệ</label>
                  <input
                    className="form-control"
                    value={Patient.address || ""}
                    name="address"
                    onChange={(e) => this.handleOnChangeInput(e)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-patient-footer">
              <button
                className="btn-patient-confirm"
                onClick={() => this.handleEditPatient()}
              >
                Xác nhận
              </button>
              <button
                className="btn-patient-cancel"
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
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { getGender: () => dispatch(actions.fetchGenderStart()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalPatient);
