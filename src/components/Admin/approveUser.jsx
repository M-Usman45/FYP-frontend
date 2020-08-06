import React, { Component } from "react";
import { Button } from "primereact/button";
import { Growl } from "primereact/growl";
import * as userService from "../../service/userService";

export class ApproveUser extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      approve: "false",
    };
    this.handleClick = this.handleClick.bind(this);
    this.getData = this.getData.bind(this);
  }

  onChange(e) {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data });
    console.log(this.state.data);
  }

  componentDidMount() {
    this.getData();
    console.log("Approve User Did mount", this.state.user);
  }

  getData() {
    const _id = this.props.location.state.id;
    console.log("props id", _id);
    userService
      .getUserInfo(_id)
      .then((result) => {
        this.setState({ user: result.data });
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Getting user failed!",
          detail: "Server error!",
        });
      });
  }

  handleClick() {
    const { user } = this.state;
    userService
      .ApproveUser(user._id)
      .then((result) => {
        this.growl.show({
          severity: "success",
          summary: "Approved User Successfully!",
        });
        setTimeout(function () {
          window.location = "#/viewUsers";
        }, 2000);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Approving User failed!",
          detail: "Server Error!",
        });
      });
  }

  render() {
    const { user } = this.state;
    let username = user.firstname + " " + user.lastname;

    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <div className="card card-w-title">
                <h1> {username} </h1>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b>User Email:</b>
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {user.email}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Department: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {user.department}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Contact: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {user.contactno}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Approved: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {user.isApproved ? "Yes" : "No"}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-3" style={{ textAlign: "right" }}>
                    <Button
                      label="Approve"
                      icon="pi pi-check"
                      className="p-button-primary"
                      onClick={this.handleClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ApproveUser;
