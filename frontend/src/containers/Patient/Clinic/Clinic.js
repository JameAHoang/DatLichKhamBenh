import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./Clinic.scss";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { searchClinic } from "../../../services/clinicService";

class Clinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listClinic: [],
    };
  }
  componentDidMount() {
    this.props.getAllClinic();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.listClinic !== prevProps.listClinic) {
      this.setState({
        listClinic: this.props.listClinic,
      });
    }
  }
  handleDetailClinic = (data) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${data.id}`);
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
        <HomeHeader></HomeHeader>
        <div className="clinic-container container">
          <div className="header-clinic">
            <div className="title-clinic">Cơ sở y tế</div>
            <div className="searchClinic">
              <input
                className="form-control"
                onChange={(e) => this.handleOnChangeInput(e)}
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <hr></hr>
          <div className="all-clinic">
            {listClinic && listClinic.length > 0 ? (
              listClinic.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }
                return (
                  <div
                    className="child-clinic"
                    key={index}
                    onClick={() => {
                      this.handleDetailClinic(item);
                    }}
                  >
                    <img src={imageBase64} className="img" alt="" />
                    <div className="name">{item.name}</div>
                  </div>
                );
              })
            ) : (
              <>Không có dữ liệu cơ sở y tế!</>
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
    listClinic: state.clinic.clinics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { getAllClinic: () => dispatch(actions.fetchAllClinic()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Clinic);
