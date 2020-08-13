import React, { Component } from "react";
import moment from "moment";
import { SplitButton } from "primereact/splitbutton";
import { Growl } from "primereact/growl";
import * as reqService from "../../service/reqService";
import * as assetService from "../../service/assetService";
import { toast} from "react-toastify";

export class RequestStatus extends Component {
  constructor() {
    super();
    this.state = {
      request: "",
      reqStatus: "Pending",
      label: "Update",
      asset: "",
      items: [
        {
          label: "Pending",
          //icon: "pi pi-refresh",
          command: (e) => {
            //this.growl.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            this.setState({ reqStatus: "pending" });
            this.setState({ label: "Pending" });
            console.log("Request Status Pending");
          },
        },
        {
          label: "Assign Asset",
          //icon: "pi pi-times",
          command: (e) => {
            this.setState({ reqStatus: "assignAsset" });
            this.setState({ label: "Assign Asset" });
            console.log("Request Status Assigned");
            console.log("Button label", this.state.label);
          },
        },
        {
          label: "Rejected",
          //icon: "pi pi-external-link",
          command: (e) => {
            this.setState({ reqStatus: "rejected" });
            this.setState({ label: "Rejected" });
            console.log("Request Status Rejected");
            console.log("Button label", this.state.label);
          },
        },
      ],
    };
    this.getAsset = this.getAsset.bind(this);
    //    this.Update = this.Update.bind(this)
    this.getData = this.getData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data });
    console.log(this.state.data);
  }

  async onSubmit() {
    const { request } = this.state;
    const { reqStatus } = this.state;
    if (reqStatus === "assignAsset") {
      //console.log("If statement assignAsset", reqStatus);
      assetService
        .assignAsset(
          request.assetTitle,
          request.userId._id,
          request.issueDate,
          request.returnDate,
          request._id
        )
        .then((result) => {
          this.growl.show({
            severity: "success",
            summary: "Asset Assigned Successfully",
          });
        })
        .catch((error) => {
          this.growl.show({
            severity: "error",
            summary: "Asset Assigned Failed",
            detail: "Server Error"
          }); 
        });
    }

    reqService
      .UpdateStatus(request._id, reqStatus)
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Request Status Updated Successfully!",
        });

        setTimeout(function () {
          window.location = "#/viewRequests";
        }, 2000);
      })
      .catch((error) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  componentDidMount() {
    console.log("Request STatus did mount");
    this.getData();
  }

  getData() {
    const _id = this.props.location.state.id;
    reqService
      .getInfo(_id)
      .then((result) => {
        //console.log("Request Status Updated Successfully", result.data)
        this.setState({ request: result.data });
        this.getAsset(result.data.assetTitle);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  getAsset(title) {
    console.log("get Asset method", title);
    assetService
      .findAsset(title)
      .then((result) => {
        this.setState({ asset: result.data });
        console.log("Find Asset", result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  render() {
    const { request, asset } = this.state;
    console.log("Asset Quantity", asset.quantity);
    let fname = request.userId
      ? request.userId.firstname
      : "No First Name Provided";
    let lname = request.userId
      ? request.userId.lastname
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
                <h1> {request.title} </h1>

                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Description: </b>
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {request.description}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Request Status: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {request.status}
                  </div>
                </div>
                <div className="p-grid">
                  <div
                    className="p-col-4"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {" "}
                    <b> Requested Asset: </b>{" "}
                  </div>
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {request.assetTitle}
                  </div>
                  {asset.quantity > 0 && (
                    <div className="p-col-4">
                      <span
                        className="pi pi-check"
                        style={{
                          color: "#038d4a",
                          textAlign: "center",
                        }}
                      >
                        Available
                      </span>
                    </div>
                  )}
                  {asset.quantity <= 0 && (
                    <div className="p-col-4">
                      <span
                        className=" pi pi-times"
                        style={{
                          color: "#a83d3b",
                          textAlign: "center",
                        }}
                      >
                        Not Available
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Issue Date: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {moment(request.issueDate).format("YYYY-MM-DD")}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> Return Date: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {moment(request.returnDate).format("YYYY-MM-DD")}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> User Id: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {request.userId ? request.userId._id : "No User Provided"}
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
                    {request.userId
                      ? request.userId.email
                      : "No email Provided"}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-4" style={{ textAlign: "left" }}>
                    {" "}
                    <b> User Department: </b>{" "}
                  </div>
                  <div className="p-col-6" style={{ textAlign: "left" }}>
                    {request.userId
                      ? request.userId.department
                      : "No Department Provided"}
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-3" style={{ textAlign: "right" }}>
                    <SplitButton
                      label={this.state.label}
                      //icon="pi pi-plus"
                      onClick={this.onSubmit}
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

export default RequestStatus;
