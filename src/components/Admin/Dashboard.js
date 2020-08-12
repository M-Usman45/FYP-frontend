import React, { Component } from "react";
import * as reqService from "../../service/reqService";
import * as compService from "../../service/compService";
import * as assetService from "../../service/assetService";
import * as adminService from "../../service/adminService";
import * as userService from "../../service/userService";
import * as anounceService from "../../service/anounceService";
import Noticeboard from "../common/noticeboard";
import CalenderProfile from "../common/calenderProfile";
import { Panel } from "primereact/panel";
import { ProgressSpinner } from "primereact/progressspinner";

export class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      requests: "",
      complains: "",
      users: "",
      admins: "",
      assets: "",
      anouncements: "",
      error: "",
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    reqService
      .getReqCount()
      .then((result) => {
        this.setState({ requests: parseInt(result.data) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    compService
      .getCompCount()
      .then((result) => {
        this.setState({ complains: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    adminService
      .getAdminCount()
      .then((result) => {
        this.setState({ admins: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    userService
      .getUserCount()
      .then((result) => {
        this.setState({ users: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    assetService
      .getAssetCount()
      .then((result) => {
        this.setState({ assets: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    anounceService
      .getAnounceCount()
      .then((result) => {
        this.setState({ anouncements: parseInt( result.data ) });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      users,
      admins,
      assets,
      requests,
      complains,
      anouncements,
    } = this.state;

    return (
      <div className="p-grid p-fluid dashboard">
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/viewUsers" style={{ color: "black" }}>
              <span className="title" style={{ cursor: "pointer" }}>
                Organization's Users
              </span>
            </a>
            <span className="detail">Number of Users</span>
            <span className="count visitors">
              {users >= 0 ? users : (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="#EEEEEE"
                  animationDuration=".5s"
                />
              )}
            </span>
          </div>
        </div>
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/viewAssets" style={{ color: "black" }}>
              <span className="title" style={{ cursor: "pointer" }}>
                Organization's Assets
              </span>
            </a>
            <span className="detail">Number of Assets</span>
            <span className="count revenue">
              {assets >= 0 ? assets : (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="#EEEEEE"
                  animationDuration=".5s"
                />
              )}
            </span>
          </div>
        </div>
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/viewAdmins" style={{ color: "black" }}>
              <span className="title" style={{ cursor: "pointer" }}>
                Organization's Admins
              </span>
            </a>
            <span className="detail">Number of Admins</span>
            <span className="count purchases">
              {admins >= 0 ? admins : (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="#EEEEEE"
                  animationDuration=".5s"
                />
              )}
            </span>
          </div>
        </div>

        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/viewRequests" style={{ color: "black" }}>
              <span className="title" style={{ cursor: "pointer" }}>
                Total Requests
              </span>
            </a>
            <span className="detail">Number of Requests</span>
            <span className="count revenue">
              {requests >= 0 ? requests :  (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="#EEEEEE"
                  animationDuration=".5s"
                />
              )}
            </span>
          </div>
        </div>
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/viewComplains" style={{ color: "black" }}>
              <span className="title" style={{ cursor: "pointer" }}>
                Total Complains
              </span>
            </a>
            <span className="detail">Number of Complains</span>
            <span className="count revenue">
              {complains >= 0 ? complains : (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="#EEEEEE"
                  animationDuration=".5s"
                />
              )}
            </span>
          </div>
        </div>

        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/viewAnounements" style={{ color: "black" }}>
              <span className="title" style={{ cursor: "pointer" }}>
                Anouncements
              </span>
            </a>
            <span className="detail">Number of Anouncements</span>
            <span className="count revenue">
              {anouncements >= 0 ? anouncements : (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                  fill="#EEEEEE"
                  animationDuration=".5s"
                />
              )}
            </span>
          </div>
        </div>
        <div className="p-col-12 p-lg-12">
          <Panel header="Noticeboard">
            <Noticeboard />
          </Panel>
        </div>
        <div className="p-col-12 p-lg-12">
            <CalenderProfile />
        </div>
      </div>
    );
  }
}
