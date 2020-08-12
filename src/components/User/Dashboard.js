import React, { Component } from "react";
import * as reqService from "../../service/reqService";
import * as compService from "../../service/compService";
import * as assetService from "../../service/assetService";
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
      assets: "",
      error: "",
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    reqService
      .getUserReqCount()
      .then((result) => {
        this.setState({ requests: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    compService
      .getUserCompCount()
      .then((result) => {
        this.setState({ complains: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
    assetService
      .getInUsedAssetCount()
      .then((result) => {
        this.setState({ assets: parseInt( result.data ) });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }

  render() {
    const { requests, complains, assets } = this.state;
    return (
      <div className="p-grid p-fluid dashboard">
        <div className="p-col-12 p-lg-4">
          <div className="card summary">
            <a href="#/userRequests" style={{ color: "black" }}>
              <span className="title">Total Requests</span>
            </a>
            <span className="detail">Number of Sended Requests</span>
            <span className="count visitors">
              {requests >=0 ? requests : (
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
            <a href="#/userComplains" style={{ color: "black" }}>
              <span className="title">Total Complains</span>
            </a>
            <span className="detail">Number of sended Complains</span>
            <span className="count purchases">
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
            <a href="#/inUsedAssets" style={{ color: "black" }}>
              <span className="title">In Used Assets</span>
            </a>
            <span className="detail">Number In Used Assets</span>
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
