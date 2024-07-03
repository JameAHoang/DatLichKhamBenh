import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
      gender: "1",
      roleId: "1",
    };
  }

  componentDidMount() {
    let user = this.props.currentUser;
    console.log("check", this.props.currentUser);
    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        password: "harcode",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phonenumber: user.phonenumber,
        gender: user.gender,
        roleId: user.roleId,
      });
    }
  }
  toggle = () => {
    this.props.toggleEditUserModal();
  };

  handleOnChangeInput = (e, id) => {
    //good code
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({
      ...copyState,
    });
    console.log(this.state);
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      "address",
      "phonenumber",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("Missign parameter: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };
  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      //call api edit model
      this.props.editUser(this.state);
    }
  };

  render() {
    console.log("check props", this.props.isOpen);
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => this.toggle()}
        size="lg"
        centered
      >
        <ModalHeader toggle={() => this.toggle()}>Edit a user</ModalHeader>
        <ModalBody>
          <div className="container">
            <div className="row">
              <form className="row g-3" method="post">
                <div className="col-md-6 form-group">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "email");
                    }}
                    value={this.state.email}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPassword4" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "password");
                    }}
                    value={this.state.password}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputFistName4" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstname"
                    placeholder="FirstName"
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "firstName");
                    }}
                    value={this.state.firstName}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputLastName4" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastname"
                    placeholder="LastName"
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "lastName");
                    }}
                    value={this.state.lastName}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputAddress" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    name="address"
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "address");
                    }}
                    value={this.state.address}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPhonenumber" className="form-label">
                    Phone number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phonenumber"
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "phonenumber");
                    }}
                    value={this.state.phonenumber}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputSex" className="form-label">
                    Sex
                  </label>
                  <select
                    name="gender"
                    className="form-select"
                    value={this.state.gender}
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "gender");
                    }}
                  >
                    <option value={1}>Male</option>
                    <option value={0}>Female</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="inputRole" className="form-label">
                    Role
                  </label>
                  <select
                    name="roleId"
                    className="form-select"
                    value={this.state.roleId}
                    onChange={(e) => {
                      this.handleOnChangeInput(e, "roleId");
                    }}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Doctor</option>
                    <option value={3}>Patient</option>
                  </select>
                </div>
                <div></div>
              </form>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => this.handleSaveUser()}
            className="btnSave"
          >
            Save
          </Button>
          <Button
            color="secondary"
            onClick={() => this.toggle()}
            className="btnClose"
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
