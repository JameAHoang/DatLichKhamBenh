import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";

import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./Specialty.scss";
import { searchSpecialty } from "../../../services/specialtyService";
class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSpecialty: [],
    };
  }
  componentDidMount() {
    this.props.getAllSpecialty();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (prevProps.allSpecialty !== this.props.allSpecialty) {
      this.setState({
        listSpecialty: this.props.allSpecialty,
      });
    }
  }
  handleOnChangeInput = async (e) => {
    let res = await searchSpecialty(e.target.value);
    console.log("check data", res);
    if (res?.errCode === 0) {
      this.setState({
        listSpecialty: res?.data,
      });
    }
  };
  handleDetailSpecialty = (data) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${data.id}`);
    }
  };
  render() {
    let { listSpecialty } = this.state;

    return (
      <>
        <HomeHeader></HomeHeader>
        <div className="specialty-container container">
          <div className="header-specialty">
            <div className="title-specialty">Chuyên khoa</div>
            <div className="searchClinic">
              <input
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e)}
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <hr></hr>
          <div className="all-specialty">
            {listSpecialty && listSpecialty.length > 0 ? (
              listSpecialty.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }
                return (
                  <div
                    className="child-specialty"
                    key={index}
                    onClick={() => {
                      this.handleDetailSpecialty(item);
                    }}
                  >
                    <img src={imageBase64} className="img" alt="" />
                    <div className="name">{item.name}</div>
                  </div>
                );
              })
            ) : (
              <>Không có dữ liệu chuyên khoa!</>
            )}
          </div>
        </div>
        <HomeFooter></HomeFooter>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allSpecialty: state.specialty.specialties,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { getAllSpecialty: () => dispatch(actions.fetchAllSpecialty()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
