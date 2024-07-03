import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorExtrainfor.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { getExtraInforDoctorId } from "../../../services/userService";
import NumberFormat from "react-number-format";

class DoctorExtrainfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfor: false,
      extraInfor: {},
    };
  }
  async componentDidMount() {
    if (this.props.doctorIdFromParent) {
      let res = await getExtraInforDoctorId(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInforDoctorId(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  showHide = () => {
    this.setState({
      isShowDetailInfor: !this.state.isShowDetailInfor,
    });
  };
  render() {
    let { language } = this.props;
    let { isShowDetailInfor, extraInfor } = this.state;
    return (
      <>
        <div className="doctor-extra-infor-container">
          <div className="content-up">
            <div className="text-address">
              <FormattedMessage id="patient.extra-infor-doctor.text-address" />
            </div>
            <div className="name-clinic">
              {extraInfor && extraInfor.Clinic && extraInfor.Clinic.name
                ? extraInfor.Clinic.name
                : ""}
            </div>
            <div className="detail-address">
              {extraInfor && extraInfor.Clinic && extraInfor.Clinic.address
                ? extraInfor.Clinic.address
                : ""}
            </div>
          </div>
          <div className="content-down">
            {isShowDetailInfor === false ? (
              <div className="short-infor">
                <span className="price">
                  <FormattedMessage id="patient.extra-infor-doctor.price" /> :
                </span>
                {extraInfor && extraInfor.priceTypeData && (
                  <NumberFormat
                    className="currency"
                    value={extraInfor.priceTypeData.value}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"VNĐ"}
                  />
                )}

                <span onClick={() => this.showHide()} className="detail">
                  <FormattedMessage id="patient.extra-infor-doctor.detail" />
                </span>
              </div>
            ) : (
              <>
                <div className="title-price">
                  <FormattedMessage id="patient.extra-infor-doctor.price" />: .
                </div>
                <div className="detail-infor">
                  <div className="price">
                    <span className="left">
                      <FormattedMessage id="patient.extra-infor-doctor.price" />
                      :
                    </span>
                    <span className="right">
                      {extraInfor && extraInfor.priceTypeData && (
                        <NumberFormat
                          className="currency"
                          value={extraInfor.priceTypeData.value}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"VNĐ"}
                        />
                      )}
                    </span>
                  </div>
                  <div className="note">
                    {extraInfor && extraInfor.note ? extraInfor.note : ""}
                  </div>
                </div>
                <div className="payment">
                  <FormattedMessage id="patient.extra-infor-doctor.payment" /> :{" "}
                  {extraInfor && extraInfor.paymentTypeData
                    ? extraInfor.paymentTypeData.value
                    : ""}
                </div>
                <div className="hide-price">
                  <span onClick={() => this.showHide()}>
                    {" "}
                    <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                  </span>
                </div>
              </>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrainfor);
