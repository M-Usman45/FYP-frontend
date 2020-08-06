import React, { Component } from "react";
import { SplitButton } from "primereact/splitbutton";
import { Growl } from "primereact/growl";
import * as compService from "../../service/compService";

export class ComplainStatus extends Component {
  constructor() {
    super();
    this.state = {
      complain: "",
      compStatus: "Pending",
      label: "Update",
      items: [
        {
          label: "Pending",
          //icon: "pi pi-refresh",
          command: (e) => {
            //this.growl.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            this.setState({ compStatus: "pending" });
            this.setState({ label: "Pending" });
            console.log("complain Status Pending");
          },
        },
        {
          label: "Approved",
          //icon: "pi pi-times",
          command: (e) => {
            this.setState({ compStatus: "approved" });
            this.setState({ label: "Approved" });
            console.log("complain Status Approved");
          },
        },
        {
          label: "Rejected",
          //icon: "pi pi-external-link",
          command: (e) => {
            this.setState({ compStatus: "rejected" });
            this.setState({ label: "Rejected" });
            console.log("complain Status Rejected");
          },
        },
      ],
    };
    this.Update = this.Update.bind(this);
    this.getData = this.getData.bind(this);
    //this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data });
    console.log(this.state.data);
  }

  componentDidMount() {
    this.getData();
    console.log("Component Did mount", this.state.complain);
  }

  getData() {
    const _id = this.props.location.state.id;
    console.log("props id", _id);
    compService
      .getInfo(_id)
      .then((result) => {
        console.log("Complain Status Updated Successfully", result.data);
        this.setState({ complain: result.data });
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Getting complains failed!",
          detail:"Server error!"
        });
      });
  }

  Update() {
    const { complain } = this.state;
    compService
      .UpdateStatus(complain._id, this.state.compStatus)
      .then((result) => {
        // toast.success("complain Status Updated");
        this.growl.show({
          severity: "success",
          summary: "Complain status updated Successfully!",
        });
        setTimeout(function () {
          window.location = "#/viewComplains";
        }, 2000);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Updating Complain status failed!",
          detail:"Server Error!"
        });
      });
  }

  render() {
    const { complain } = this.state;
    let fname = complain.userId
      ? complain.userId.firstname
      : "No First Name Provided";
    let lname = complain.userId
      ? complain.userId.lastname
      : "No Last Name Provided";
    let username = fname.concat(" ", lname);

    return (
      <React.Fragment>
        {/* <ToastContainer draggable={true} transition={Zoom} autoClose={4000} /> */}
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <div className="card card-w-title">
                <h1> {complain.title} </h1>

                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Description: </b>
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {complain.description}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> complain Status: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {complain.status}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> User Name: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {username}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> User Email: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {complain.userId
                      ? complain.userId.email
                      : "No email Provided"}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> User Department: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {complain.userId
                      ? complain.userId.department
                      : "No Department Provided"}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-3" style={{ textAlign: "right" }}>
                    <SplitButton
                      label={this.state.label}
                      //icon="pi pi-plus"
                      onClick={this.Update}
                      model={this.state.items}
                    ></SplitButton>
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

export default ComplainStatus;
