import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import { getUsersByRoleName } from "../../../services/userService";
import moment from "moment";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Users: [],
      roles: "",
      selectedRole: {
        label: this.props.language === LANGUAGES.VI ? "Tất cả" : "All",
        value: "R0",
      },
      searchName: "",
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
    this.props.getRole();
  }
  handleChangeSelect = async (selectedRole) => {
    this.setState({ selectedRole });
    await this.props.getUsersByRole(selectedRole.value);
  };
  buildDataRole = (data) => {
    let result = [];
    let language = this.props.language;
    let object = {};
    object.label = language === LANGUAGES.VI ? "Tất cả" : "All";
    object.value = "R0";
    result.push(object);
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = item.value;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        Users: this.props.listUsers,
      });
    }
    if (this.props.language !== prevProps.language) {
      this.setState({
        roles: this.buildDataRole(this.props.listRoles),
        selectedRole: {
          label: this.props.language === LANGUAGES.VI ? "Tất cả" : "All",
          value: "R0",
        },
        Users: this.props.listUsers,
      });
    }
    if (this.props.listRoles !== prevProps.listRoles) {
      this.setState({
        roles: this.buildDataRole(this.props.listRoles),
      });
    }

    if (this.props.usersByRole !== prevProps.usersByRole) {
      this.setState({
        Users: this.props.usersByRole,
      });
    }
  }

  handleDeleteUser = (user) => {
    this.props.deleteAUser(user.id);
  };

  handleEditUser = (user) => {
    this.props.handleEditUserFromParent(user);
  };

  handleOnChangeInput = async (e) => {
    this.setState({
      searchName: e.target.value,
    });

    let name = e.target.value;
    let roleId = this.state.selectedRole.value;

    let res = await getUsersByRoleName(roleId, name);
    if (res && res.errCode === 0) {
      this.setState({
        Users: res.data.reverse(),
      });
    }
  };
  render() {
    let arrUsers = this.state.Users;
    let { language } = this.props;
    return (
      <>
        <div className="manage-container">
          <div className="search">
            <div className="searchRole">
              <Select
                value={this.state.selectedRole}
                onChange={this.handleChangeSelect}
                options={this.state.roles}
                placeholder={<FormattedMessage id="manage-user.searchRole" />}
              />
            </div>
            <div className="searchName">
              <input
                className="form-control"
                value={this.state.searchName}
                onChange={(e) => this.handleOnChangeInput(e)}
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <table id="customers">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="manage-user.email" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.fullname" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.address" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.birthday" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.phone-number" />
                </th>
                <th>
                  <FormattedMessage id="manage-user.action" />
                </th>
              </tr>
            </thead>
            <tbody>
              {arrUsers && arrUsers.length > 0 ? (
                arrUsers.map((res, index) => {
                  let convertDay =
                    Number(moment.utc(res.birthday).format("DD")) + 1;
                  let day = convertDay > 9 ? convertDay : "0" + convertDay;
                  let month = moment.utc(res.birthday).format("MM");
                  let year = moment.utc(res.birthday).format("YYYY");
                  let birthday = day + "/" + month + "/" + year;
                  return (
                    <tr key={res.id}>
                      <td>{res.email}</td>
                      <td>
                        {language === LANGUAGES.VI
                          ? res.lastName + " " + res.firstName
                          : res.firstName + " " + res.lastName}
                      </td>
                      <td>{res.address}</td>
                      <td>{res.birthday ? birthday : ""}</td>
                      <td>{res.phonenumber}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => this.handleEditUser(res)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => this.handleDeleteUser(res)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
    listRoles: state.admin.roles,
    language: state.app.language,
    usersByRole: state.admin.usersByRole,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUser: (id) => dispatch(actions.deleteAUserStart(id)),
    getRole: () => dispatch(actions.fetchRoleStart()),
    getUsersByRole: (role) => dispatch(actions.fetchUsersByRoleStart(role)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
