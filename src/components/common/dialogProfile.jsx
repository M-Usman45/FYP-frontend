import React, { Component } from "react";
import moment from "moment";
import { Dialog } from "primereact/dialog";
import * as reqService from "../../service/reqService";
import * as compService from "../../service/compService";
class DialogProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      visible: false,
    };
    this.onClick = this.onClick.bind(this);
    this.onHide = this.onHide.bind(this);
    this.getRequestInfo = this.getRequestInfo.bind(this);
    this.getComplainInfo = this.getComplainInfo.bind(this);
    this.UserDetails = this.UserDetails.bind(this);
    //this.getUserComplains = this.getUserComplains.bind(this)
  }
  componentDidMount() {
    if (this.props.type === "request") this.getRequestInfo();
    else if (this.props.type === "complain") this.getComplainInfo();
    else if (this.props.type === "userComplains") this.getComplainInfo();
    //this.UserComplains()
    else if (this.props.type === "userRequests") this.getRequestInfo();
    //this.UserRequests()
    else return null;
  }

  UserRequests() {
    reqService
      .getUserRequests()
      .then((result) => {
        this.setState({ content: result.data });
        console.log(this.state.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  UserComplains() {
    compService
      .getUserComplains()
      .then((result) => {
        this.setState({ content: result.data });
        console.log(this.state.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getRequestInfo() {
    reqService
      .getInfo(this.props._id)
      .then((result) => {
        this.setState({ content: result.data });
        console.log(this.state.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getComplainInfo() {
    compService
      .getInfo(this.props._id)
      .then((result) => {
        this.setState({ content: result.data });
        console.log(this.state.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onClick() {
    this.setState({ visible: true });
  }

  onHide() {
    this.setState({ visible: false });
  }

  renderListItem(content) {
    //const { type } = this.props.type
    if (this.props.type === "request") return this.renderRequestItem(content);
    else if (this.props.type === "complain")
      return this.renderComplainItem(content);
    else if (this.props.type === "userComplains")
      return this.renderUserComplains(content);
    else if (this.props.type === "userRequests")
      return this.renderUserRequests(content);
    else return null;
  }

  renderUserRequests(content) {
    return (
      <React.Fragment>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Request Status: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.status}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Requested Asset: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.assetTitle}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Description: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.description}
          </div>
        </div>

        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Issue Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.issueDate).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Return Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.returnDate).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Sending Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.sendDate).format("YYYY-MM-DD")}
          </div>
        </div>
      </React.Fragment>
    );
  }

  renderRequestItem(content) {
    return (
      <React.Fragment>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Description: </b>
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.description}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Request Status: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.status}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Requested Asset: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.assetTitle}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Issue Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.issueDate).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Return Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.returnDate).format("YYYY-MM-DD")}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Receiving Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.sendDate).format("YYYY-MM-DD")}
          </div>
        </div>

        {this.UserDetails(content)}
      </React.Fragment>
    );
  }
  renderComplainItem(content) {
    return (
      <React.Fragment>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Description: </b>
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.description}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Complain Status: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.status}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Receiving Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.sendDate).format("YYYY-MM-DD")}
          </div>
        </div>
        {this.UserDetails(content)}
      </React.Fragment>
    );
  }

  renderUserComplains(content) {
    return (
      <React.Fragment>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Description: </b>
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.description}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Complain Status: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.status}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> Sending Date: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {moment(content.sendDate).format("YYYY-MM-DD")}
          </div>
        </div>
      </React.Fragment>
    );
  }

  UserDetails(content) {
    let fname = content.userId
      ? content.userId.firstname
      : "No First Name Provided";
    let lname = content.userId
      ? content.userId.lastname
      : "No Last Name Provided";
    let username = fname.concat(" ", lname);
    return (
      <React.Fragment>
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
            {content.userId ? content.userId.email : "No email Provided"}
          </div>
        </div>
        <div className="p-grid">
          <div className="p-col-4" style={{ textAlign: "left" }}>
            {" "}
            <b> User Department: </b>{" "}
          </div>
          <div className="p-col-6" style={{ textAlign: "left" }}>
            {content.userId
              ? content.userId.department
              : "No Department Provided"}
          </div>
        </div>
      </React.Fragment>
    );
  }
  render() {
    const footer = (
      <div style={{ height: "25px" }}>
        {/* <Button label="Hide" icon="pi pi-check" onClick={this.onHide} /> */}
      </div>
    );
    return (
      <div>
        <div className="content-section implementation">
          <Dialog
            header={this.state.content.title}
            visible={this.state.visible}
            style={{ width: "50vw" }}
            footer={footer}
            dismissableMask={true}
            blockScroll={false}
            itemTemplate={this.renderListItem}
            onHide={this.onHide}
            maximizable={true}
          >
            {this.renderListItem(this.state.content)}
          </Dialog>
          <i onClick={this.onClick}> {this.state.content.title} </i>
        </div>
      </div>
    );
  }
}

export default DialogProfile;
