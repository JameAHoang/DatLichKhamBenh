import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

import Select from "react-select";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";
import {
  deleteDoctorInfor,
  getDetailDoctorService,
  saveDetailDoctorService,
} from "../../../services/userService";
import { getClinicByAddress } from "../../../services/clinicService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      //save to doctor_inffor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listSpecialty: [],
      listClinic: [],
      selectedClinic: "",
      selectedSpecialty: "",
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      note: "",
    };
  } // Finish!
  ClearInput = () => {
    this.setState({
      selectedDoctor: "",
      contentHTML: "",
      contentMarkdown: "",
      description: "",
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      note: "",
      hasOldData: false,
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  handleChange = async (selectedDoctor) => {
    this.setState({ selectedDoctor });

    let { listPrice, listPayment, listProvince, listSpecialty, listClinic } =
      this.state;
    let res = await getDetailDoctorService(selectedDoctor.value);
    console.log(res, "check res data");
    if (
      res &&
      res.errCode === 0 &&
      res.data &&
      res.data.Markdown &&
      res.data.Markdown.contentMarkdown !== null &&
      res.data.Doctor_Infor
    ) {
      let markdown = res.data.Markdown;

      let description = "",
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        specialtyId = "",
        clinicId = "",
        selectedPrice = "",
        selectedPayment = "",
        selectedProvince = "",
        selectedSpecialty = "",
        selectedClinic = "";

      if (res.data.Doctor_Infor) {
        note = res.data.Doctor_Infor.note;
        description = res.data.Doctor_Infor.description;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;
        selectedPrice = listPrice.find((item) => {
          return item && item.value === priceId;
        });
        selectedPayment = listPayment.find((item) => {
          return item && item.value === paymentId;
        });
        selectedProvince = listProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectedSpecialty = listSpecialty.find((item) => {
          return item && item.value === specialtyId;
        });
        selectedClinic = listClinic.find((item) => {
          return item && item.value === clinicId;
        });
      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: description,
        hasOldData: true,
        note: note,
        selectedPrice: selectedPrice ? selectedPrice : "",
        selectedPayment: selectedPayment ? selectedPayment : "",
        selectedProvince: selectedProvince ? selectedProvince : "",
        selectedSpecialty: selectedSpecialty ? selectedSpecialty : "",
        selectedClinic: selectedClinic ? selectedClinic : "",
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        note: "",
        selectedPrice: "",
        selectedPayment: "",
        selectedProvince: "",
        selectedSpecialty: "",
        selectedClinic: "",
      });
    }
  };
  handleChangeSelectDocorInfor = async (selectedDoctor, name) => {
    if (name && name.name === "selectedProvince") {
      let resClinic = await getClinicByAddress(selectedDoctor.label);
      if (resClinic && resClinic.errCode === 0 && resClinic.data) {
        let dataClinic = this.buildDataInputSelect(resClinic.data, "CLINIC");
        this.setState({
          listClinic: dataClinic,
        });
      }
      let stateName = name.name;
      let stateCopy = { ...this.state };
      stateCopy[stateName] = selectedDoctor;
      this.setState({
        ...stateCopy,
      });
    } else {
      let stateName = name.name;
      let stateCopy = { ...this.state };
      stateCopy[stateName] = selectedDoctor;
      this.setState({
        ...stateCopy,
      });
    }
  };
  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  componentDidMount() {
    this.props.getAllDoctors();
    this.props.getDoctorInforStart();
  }
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelName = `${item.lastName} ${item.firstName}`;
          object.label = labelName;
          object.value = item.id;
          result.push(object);
        });
      }

      if (type === "PRICE") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.value;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.value;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let dataPrice = this.buildDataInputSelect(
        this.props.allDoctorInfor.resPrice,
        "PRICE"
      );
      let dataPayment = this.buildDataInputSelect(
        this.props.allDoctorInfor.resPayment,
        "PAYMENT"
      );
      let dataProvince = this.buildDataInputSelect(
        this.props.allDoctorInfor.resProvince,
        "PROVINCE"
      );
      this.setState({
        listDoctors: dataSelect,
        listPrice: dataPrice,
        listPayment: dataPayment,
        listProvince: dataProvince,
      });
    }

    if (prevProps.allDoctorInfor !== this.props.allDoctorInfor) {
      let dataPrice = this.buildDataInputSelect(
        this.props.allDoctorInfor.resPrice,
        "PRICE"
      );
      let dataPayment = this.buildDataInputSelect(
        this.props.allDoctorInfor.resPayment,
        "PAYMENT"
      );
      let dataProvince = this.buildDataInputSelect(
        this.props.allDoctorInfor.resProvince,
        "PROVINCE"
      );
      let dataSpecialty = this.buildDataInputSelect(
        this.props.allDoctorInfor.resSpecialty,
        "SPECIALTY"
      );
      let dataClinic = this.buildDataInputSelect(
        this.props.allDoctorInfor.resClinic,
        "CLINIC"
      );

      this.setState({
        listPrice: dataPrice,
        listPayment: dataPayment,
        listProvince: dataProvince,
        listSpecialty: dataSpecialty,
        listClinic: dataClinic,
      });
    }
  }
  validateData = () => {
    let {
      selectedDoctor,
      description,
      selectedPrice,
      selectedPayment,
      selectedProvince,
      selectedClinic,
      selectedSpecialty,
      contentHTML,
      contentMarkdown,
    } = this.state;

    if (selectedDoctor === "") {
      toast.error("Vui lòng chọn bác sĩ");
      return;
    }
    if (description === "") {
      toast.error("Vui lòng thêm thông tin giới thiệu");
      return;
    }
    if (selectedPrice === "") {
      toast.error("Vui lòng chọn giá khám bênh");
      return;
    }
    if (selectedPayment === "") {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }
    if (selectedProvince === "") {
      toast.error("Vui lòng chọn tỉnh thành");
      return;
    }
    if (selectedSpecialty === "") {
      toast.error("Vui lòng chọn chuyên khoa");
      return;
    }
    if (selectedClinic === "") {
      toast.error("Vui lòng chọn phòng khám");
      return;
    }
    if (contentMarkdown === "" || contentHTML === "") {
      toast.error("Vui lòng thêm thông tin mô tả bác sĩ");
      return;
    }
  };
  handleSaveContentMarkdown = async () => {
    let { hasOldData } = this.state;

    let res = await saveDetailDoctorService({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      doctorId: this.state.selectedDoctor.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
      priceId: this.state.selectedPrice.value,
      paymentId: this.state.selectedPayment.value,
      provinceId: this.state.selectedProvince.value,
      description: this.state.description,
      note: this.state.note,
      specialtyId: this.state.selectedSpecialty.value,
      clinicId: this.state.selectedClinic.value,
    });
    if (res && res.errCode === 0) {
      if (hasOldData === true) {
        toast.success("Sửa thông tin thành công!");
      } else {
        toast.success("Thêm thông tin thành công!");
      }
      this.setState({
        hasOldData: true,
      });
    } else if (res && res.errCode === 1) {
      this.validateData();
    } else {
      toast.error("Thêm thông tin thất bại!");
    }
  };
  handleDeleteDoctorInfor = async () => {
    let id = this.state.selectedDoctor.value;
    let res = await deleteDoctorInfor(id);
    if (res && res.errCode === 0) {
      toast.success("Xóa thông tin thành công!");
      this.ClearInput();
    } else {
      toast.error("Xóa thông tin thất bại!");
    }
    console.log("check delete", id);
  };
  render() {
    let {
      selectedDoctor,
      hasOldData,
      selectedPrice,
      selectedPayment,
      selectedProvince,
      selectedSpecialty,
    } = this.state;
    return (
      <>
        <div className="manage-doctor-container">
          <div className="manage-doctor-title">
            <FormattedMessage id="admin.manage-doctor.title" />
          </div>
          <div className="more-info">
            <div className="content-left form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              </label>
              <Select
                value={selectedDoctor}
                onChange={this.handleChange}
                options={this.state.listDoctors}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.select-doctor" />
                }
              />
            </div>
            <div className="content-right">
              <label>
                <FormattedMessage id="admin.manage-doctor.intro" />
              </label>
              <textarea
                className="form-control"
                rows="4"
                onChange={(event) =>
                  this.handleOnChangeText(event, "description")
                }
                value={this.state.description}
              ></textarea>
            </div>
          </div>

          <div className="more-infor-extra row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.price" />
              </label>
              <Select
                value={selectedPrice}
                onChange={this.handleChangeSelectDocorInfor}
                options={this.state.listPrice}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.price" />
                }
                name="selectedPrice"
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.payment" />
              </label>
              <Select
                value={selectedPayment}
                onChange={this.handleChangeSelectDocorInfor}
                options={this.state.listPayment}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.payment" />
                }
                name="selectedPayment"
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.province" />
              </label>
              <Select
                value={selectedProvince}
                onChange={this.handleChangeSelectDocorInfor}
                options={this.state.listProvince}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.province" />
                }
                name="selectedProvince"
              />
            </div>
            {/* <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.nameClinic" />
              </label>
              <input
                className="form-control"
                onChange={(event) =>
                  this.handleOnChangeText(event, "nameClinic")
                }
                value={this.state.nameClinic}
              ></input>
            </div> */}
            {/* <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.addressClinic" />
              </label>
              <input
                className="form-control"
                onChange={(event) =>
                  this.handleOnChangeText(event, "addressClinic")
                }
                value={this.state.addressClinic}
              ></input>
            </div> */}
          </div>

          <div className="row">
            <div className="col-4 form-group">
              <label>Chọn chuyên khoa</label>
              <Select
                value={selectedSpecialty}
                onChange={this.handleChangeSelectDocorInfor}
                options={this.state.listSpecialty}
                placeholder={
                  // <FormattedMessage id="admin.manage-doctor.province" />
                  "Chọn chuyên khoa"
                }
                name="selectedSpecialty"
              />
            </div>
            <div className="col-4 form-group">
              <label>Chọn phòng khám</label>
              <Select
                value={this.state.selectedClinic}
                onChange={this.handleChangeSelectDocorInfor}
                options={this.state.listClinic}
                placeholder={
                  // <FormattedMessage id="admin.manage-doctor.province" />
                  "Chọn phòng khám"
                }
                name="selectedClinic"
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.note" />
              </label>
              <input
                className="form-control"
                onChange={(event) => this.handleOnChangeText(event, "note")}
                value={this.state.note}
              ></input>
            </div>
          </div>
          <div className="manage-doctor-editor">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
          </div>
          <button
            className={
              hasOldData === true
                ? "save-content-doctor"
                : "create-content-doctor"
            }
            onClick={() => this.handleSaveContentMarkdown()}
          >
            {hasOldData === true ? (
              <FormattedMessage id="admin.manage-doctor.save" />
            ) : (
              <FormattedMessage id="admin.manage-doctor.add" />
            )}
          </button>
          {hasOldData === true && (
            <button
              className="delete-content-doctor"
              onClick={() => this.handleDeleteDoctorInfor()}
            >
              Xóa thông tin
            </button>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allDoctorInfor: state.admin.allDoctorInfor,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllDoctors: () => dispatch(actions.fetchAllDoctor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    getDoctorInforStart: () => dispatch(actions.fetchDoctorInforStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
