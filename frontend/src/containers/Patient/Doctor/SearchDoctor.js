import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import "./SearchDoctor.scss";
import {
  getAllDoctorsAndLocationSpecialty,
  searchDoctor,
} from "../../../services/userService";
class SearchDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  async componentDidMount() {
    let res = await getAllDoctorsAndLocationSpecialty();
    console.log("check res doctorr", res);
    if (res && res.errCode === 0) {
      this.setState({
        arrDoctors: res.data,
      });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  handleOnChangeInput = async (e) => {
    let res = await searchDoctor(e.target.value);
    if (res?.errCode === 0) {
      this.setState({
        arrDoctors: res?.data,
      });
    }
  };
  handleDetailDoctor = (data) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${data.id}`);
    }
  };

  render() {
    let { arrDoctors } = this.state;
    return (
      <>
        <HomeHeader></HomeHeader>

        <div className="doctor-container container">
          <div className="header-doctor">
            <div className="title-doctor">Bác sĩ</div>
            <div className="searchClinic">
              <input
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e)}
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <hr></hr>
          <div className="all-doctor">
            {arrDoctors && arrDoctors.length > 0 ? (
              arrDoctors.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }
                let name = `${item.positionData.value}, ${item.lastName} ${item.firstName}`;

                return (
                  <div
                    className="child-doctor"
                    key={index}
                    onClick={() => {
                      this.handleDetailDoctor(item);
                    }}
                  >
                    <div className="bg-img">
                      <img src={imageBase64} className="img" alt="" />
                      <div className="name"> {name}</div>
                      <div className="specialty">
                        {item.Doctor_Infor.Specialty.name}
                      </div>
                    </div>
                    {/* <div className="namse">{item.name}</div> */}
                  </div>
                );
              })
            ) : (
              <>Không có dữ liệu bác sĩ!</>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchDoctor);
