import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    this.getAllUsers();
  }
  getAllUsers = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
  };
  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };
  handleEditUser = (user) => {
    this.setState({
      isOpenModalEditUser: true,
      userEdit: user,
    });
  };

  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };
  toggleEditUserModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };
  createNewUser = async (data) => {
    try {
      let res = await createNewUserService(data);
      if (res && res.errCode !== 0) {
        alert(res.message);
      } else {
        await this.getAllUsers();
        this.setState({
          isOpenModalUser: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteUser = async (user) => {
    console.log("Check user", user);
    try {
      let res = await deleteUserService(user.id);
      console.log(res);
      if (res && res.errCode === 0) {
        await this.getAllUsers();
      } else {
        alert(res.errMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  doEditUser = async (user) => {
    console.log("check edit user", user);
    try {
      let res = await editUserService(user);
      if (res && res.errCode === 0) {
        await this.getAllUsers();
        this.setState({
          isOpenModalEditUser: false,
        });
      } else {
        alert(res.errMessage);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  /** Life cycle
   * Run component:
   * 1. Run construct -> init state
   * 2. Did mount
   * 3. Render
   */
  render() {
    let arrUsers = this.state.arrUsers;
    return (
      <>
        <div className="user-container">
          <div className="title">Manage users with Jame</div>
          <div className="mx-1">
            <button
              className="btn btn-primary px-2"
              onClick={() => this.handleAddNewUser()}
            >
              <i className="fas fa-plus px-1"></i>Add new users
            </button>
            <ModalUser
              isOpen={this.state.isOpenModalUser}
              toggleUserModal={this.toggleUserModal}
              createNewUser={this.createNewUser}
            />
            {this.state.isOpenModalEditUser && (
              <ModalEditUser
                isOpen={this.state.isOpenModalEditUser}
                toggleEditUserModal={this.toggleEditUserModal}
                currentUser={this.state.userEdit}
                editUser={this.doEditUser}
              />
            )}
          </div>
          <div className="users-table mt-3 mx-1">
            <table id="customers">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {arrUsers &&
                  arrUsers.map((res, index) => {
                    return (
                      <tr key={res.id}>
                        <td>{res.email}</td>
                        <td>{res.firstName}</td>
                        <td>{res.lastName}</td>
                        <td>{res.address}</td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => this.handleEditUser(res)}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => this.handleDeleteUser(res)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
