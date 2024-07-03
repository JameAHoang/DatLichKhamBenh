import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailManageClinic.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import * as actions from "../../../store/actions";
import {
  createDetailClinic,
  deletaDetailClinic,
  editDetailClinic,
  getDetailClinicById,
} from "../../../services/clinicService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class DetailManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedClinic: "",
      clinics: "",
      contentHTML: "",
      contentMarkdown: "",
      hasOldData: false,
    };
  }
  componentDidMount() {
    this.props.getAllClinic();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.listClinic !== prevProps.listClinic) {
      let dataSelect = this.buildDataInputSelect(this.props.listClinic);
      this.setState({
        clinics: dataSelect,
      });
    }
  }
  handleChange = async (selectedClinic) => {
    this.setState({ selectedClinic });
    let res = await getDetailClinicById(selectedClinic.value);
    if (res && res.errCode === 0 && res.data) {
      this.setState({
        contentHTML: res.data.contentHTML,
        contentMarkdown: res.data.contentMarkdown,
        hasOldData: true,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        hasOldData: false,
      });
    }
  };
  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.name;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  clearInputData = () => {
    this.setState({
      selectedClinic: "",
      contentMarkdown: "",
      contentHTML: "",
      hasOldData: false,
    });
  };
  handleSaveDetailClinic = async () => {
    let { hasOldData, selectedClinic, contentMarkdown, contentHTML } =
      this.state;

    if (hasOldData === true) {
      ///UPDATE
      let res = await editDetailClinic({
        id: selectedClinic.value,
        contentHTML: contentHTML,
        contentMarkdown: contentMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Sửa thông tin thành công!");
      } else {
        toast.error("Sửa thông tin thất bại!");
      }
    } else {
      //CREATE
      if (selectedClinic === "") {
        toast.error("Vui lòng chọn phòng khám!");
        return;
      }
      if (contentHTML === "" || contentMarkdown === "") {
        toast.error("Vui lòng nhập mô tả phòng khám!");
        return;
      }
      let res = await createDetailClinic({
        clinicId: this.state.selectedClinic.value,
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Thêm mới thông tin thành công!");
        this.clearInputData();
      } else {
        toast.error("Thêm mới thông tin thất bại!");
      }
    }
  };
  handleDelete = async () => {
    let { selectedClinic } = this.state;
    let res = await deletaDetailClinic(selectedClinic.value);
    if (res && res.errCode === 0) {
      toast.success("Xóa thông tin thành công!");
      this.clearInputData();
    } else {
      toast.error("Xóa thông tin thất bại!");
    }
  };
  render() {
    let { language } = this.props;
    let { hasOldData } = this.state;
    console.log("check state", this.state);
    return (
      <>
        <div className="detail-manage-clinic container">
          <div className="dmc-title">Quản lý chi tiết phòng khám</div>
          <div className="detail-manage-clinic-content row">
            <div className="select-clinic form-group col-6">
              <label className="form-label">Chọn phòng khám</label>
              <Select
                value={this.state.selectedClinic}
                onChange={this.handleChange}
                options={this.state.clinics}
                placeholder={
                  //   <FormattedMessage id="admin.manage-doctor.select-doctor" />
                  "Chọn phòng khám"
                }
              />
            </div>
          </div>
          <div className="detail-manage-clinic-editor">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
          </div>
          <div className="btn-detail-clinic">
            <button
              className={
                hasOldData === true ? "btn btn-warning" : "btn btn-primary"
              }
              onClick={() => {
                this.handleSaveDetailClinic();
              }}
            >
              {hasOldData === true ? "Sửa thông tin" : "Lưu thông tin"}
            </button>
            {hasOldData === true && (
              <button
                className="btn btn-danger delete"
                onClick={() => this.handleDelete()}
              >
                Xóa thông tin
              </button>
            )}
          </div>
        </div>
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
  return { getAllClinic: () => dispatch(actions.fetchAllClinic()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailManageClinic);
