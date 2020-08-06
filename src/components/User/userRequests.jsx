import React, { Component } from "react";
import { Growl } from "primereact/growl";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as reqService from "../../service/reqService";
import { Button } from "primereact/button";
import DialogProfile from "../common/dialogProfile";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

class UserRequests extends Component {
  constructor() {
    super();
    this.state = {
      requests: null,
    };
    this.getrequests = this.getrequests.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    TimeAgo.addLocale(en);
    this.TimeAgo = new TimeAgo("en-US");
  }

  componentDidMount() {
    this.getrequests();
  }
  getrequests() {
    this.setState({ requests: null });
    reqService
      .getUserRequests()
      .then((result) => {
        this.setState({ requests: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Geting Requests failed",
          detail: "Server error!",
        });
      });
  }
  renderDate = (rowData, column) => {
    const time = new Date(rowData.issueDate);
    return (
      <>
        <div>{this.TimeAgo.format(time)}</div>
      </>
    );
  };
  onEdit(rowData) {
    //console.log("Update Button", rowData._id)
    return (
      <div>
        <Link
          to={{
            pathname: "/editRequest",
            state: {
              id: rowData._id,
            },
          }}
        > 
          <Button
            type="button"
            //icon="pi pi-pencil"
            disabled={rowData.status === "assignAsset" ? true : false}
            label="Edit"
            className="p-button-primary"
          ></Button>
        </Link>
      </div>
    );
  }
  onDelete(data) {
    let { requests } = this.state;
    const orignalRequests = requests;
    requests = requests.filter((m) => m._id !== data._id);
    this.setState({ requests: requests });

    reqService
      .deleteReq(data._id)
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Request Successfully!",
        });
        setTimeout(function () {
          window.location = "#/userRequests";
        }, 2000);
      })
      .catch((err) => {
        alert(err);
        this.setState({ requests: orignalRequests });
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Deleting Request failed ",
          detail: "Server error!",
        });
      });
  }

  render() {
    const { requests } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getrequests();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div style={{ textAlign: "center" }}>
          {!requests && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {requests && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={requests}
                  autoLayout={true}
                  paginator={true}
                  responsive={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    field="title"
                    header="Title"
                    filter={true}
                    body={(rowData) => {
                      return (
                        <div>
                          <DialogProfile
                            type="userRequests"
                            _id={rowData._id}
                          />
                        </div>
                      );
                    }}
                  />

                  <Column field="status" filter={true} header="Status" />
                  <Column
                    field="category"
                    filter={true}
                    header="Asset's Category"
                  />
                  <Column
                    field="assetTitle"
                    filter={true}
                    header="Requested Asset"
                  />
                  <Column
                    header="Asset's Issue Date"
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.issueDate).format("YYYY-MM-DD")}
                        </div>
                      );
                    }}
                  />
                  <Column
                    header="Asset's Retuen Date"
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.returnDate).format("YYYY-MM-DD")}
                        </div>
                      );
                    }}
                  />
                  <Column
                    header="Send Date"
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.sendDate).format("YYYY-MM-DD")}
                        </div>
                      );
                    }}
                  />
                  <Column header="Edit" body={this.onEdit} />
                  <Column
                    header="Delete"
                    body={(rowData) => {
                      return (
                        <Button
                          type="button"
                          //icon="pi pi-pencil"
                          disabled={
                            rowData.status === "assignAsset" ? true : false
                          }
                          label="Delete"
                          className="p-button-danger"
                          onClick={() => this.onDelete(rowData)}
                        />
                      );
                    }}
                  />
                </DataTable>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default UserRequests;
