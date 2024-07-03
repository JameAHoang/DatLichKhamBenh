import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailManageSpecialty.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import * as actions from "../../../store/actions";
import {
  createDetailSpecialty,
  deleteDetailSpecialty,
  editDetailSpecialty,
  getDetailSpecialtyById,
} from "../../../services/specialtyService";
import { toast } from "react-toastify";
import { has } from "lodash";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class DetailManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSpecialty: "",
      specialties: "",
      contentHTML: "",
      contentMarkdown: "",
      hasOldData: false,
    };
  }
  componentDidMount() {
    this.props.getAllSpecialty();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.AllSpecialty !== prevProps.AllSpecialty) {
      let dataSelect = this.buildDataInputSelect(this.props.AllSpecialty);
      this.setState({
        specialties: dataSelect,
      });
    }
  }
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
  handleChange = async (selectedSpecialty) => {
    this.setState({ selectedSpecialty });
    let res = await getDetailSpecialtyById(selectedSpecialty.value);
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
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  clearInputData = () => {
    this.setState({
      selectedSpecialty: "",
      contentMarkdown: "",
      contentHTML: "",
      hasOldData: false,
    });
  };
  handleSaveDetailSpecialty = async () => {
    let { hasOldData, selectedSpecialty, contentHTML, contentMarkdown } =
      this.state;
    if (selectedSpecialty === "") {
      toast.error("Vui lòng chọn chuyên khoa!");
      return;
    }
    if (contentHTML === "" || contentMarkdown === "") {
      toast.error("Vui lòng nhập mô tả chuyên khoa!");
      return;
    }
    if (hasOldData === true) {
      //UPDATE
      let res = await editDetailSpecialty({
        id: selectedSpecialty.value,
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Sửa thông tin thành công!");
      } else {
        toast.error("Sửa thông tin thất bại!");
      }
    } else {
      //CREATE
      let res = await createDetailSpecialty({
        specialtyId: this.state.selectedSpecialty.value,
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
    let { selectedSpecialty } = this.state;
    let res = await deleteDetailSpecialty(selectedSpecialty.value);
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
    console.log(this.state);
    return (
      <>
        <div className="detail-manage-specialty container">
          <div className="dms-title">Quản lý chi tiết chuyên khoa</div>
          <div className="detail-manage-specialty-content row">
            <div className="select-specialty form-group col-6">
              <label className="form-label">Chọn chuyên khoa</label>
              <Select
                value={this.state.selectedSpecialty}
                onChange={this.handleChange}
                options={this.state.specialties}
                placeholder={
                  //   <FormattedMessage id="admin.manage-doctor.select-doctor" />
                  "Chọn chuyên khoa"
                }
              />
            </div>
          </div>
          <div className="detail-manage-specialty-editor">
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.contentMarkdown}
            />
          </div>
          <div className="btn-detail-specialty">
            <button
              className={
                hasOldData === true ? "btn btn-warning" : "btn btn-primary"
              }
              onClick={() => {
                this.handleSaveDetailSpecialty();
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
    AllSpecialty: state.specialty.specialties,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllSpecialty: () => dispatch(actions.fetchAllSpecialty()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailManageSpecialty);
