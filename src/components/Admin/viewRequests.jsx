import React, { Component } from "react";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Growl } from "primereact/growl";
import { ProgressSpinner } from "primereact/progressspinner";
import * as reqService from "../../service/reqService";
import DialogProfile from "../common/dialogProfile";
import { Link } from "react-router-dom";

class viewRequests extends Component {
  constructor() {
    super();
    this.state = {
      requests: null,
    };
    this.getrequests = this.getrequests.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
  }

  componentDidMount() {
    this.getrequests();
  }
  getrequests() {
    this.setState({ requests: null });
    reqService
      .viewRequests()
      .then((result) => {
        this.setState({ requests: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }

  actionTemplate(rowData) {
    //console.log("Update Button", rowData._id)
    return (
      <div>
        <Link
          to={{
            pathname: "/requestStatus",
            state: {
              id: rowData._id,
            },
          }}
        >
          <Button
            type="button"
            label="Update"
            className="p-button-primary"
          ></Button>
        </Link>
      </div>
    );
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
                  paginator={true}
                  autoLayout={true}
                  responsive={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    field="title"
                    header="Request Title"
                    filter={true}
                    body={(rowData) => {
                      return (
                        <div
                          style={{
                            textAlign: "center",
                            alignContent: "center",
                          }}
                        >
                          <DialogProfile type="request" _id={rowData._id} />
                        </div>
                      );
                    }}
                  />
                  <Column
                    field="assetTitle"
                    filter={true}
                    header="Requested Asset"
                  />
                  <Column
                    field="status"
                    filter={true}
                    header="Request Status"
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

                  <Column
                    header="Issue Date "
                    //filter={true}
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.issueDate).format("YYYY-MM-DD")}
                        </div>
                      );
                    }}
                  />
                  <Column
                    //filter={true}
                    header="Return  Date"
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.returnDate).format("YYYY-MM-DD")}
                        </div>
                      );
                    }}
                  />
                  <Column
                    //filter={true}
                    header="Username"
                    body={(rowData) => {
                      let fname = rowData.userId
                        ? rowData.userId.firstname
                        : "No First Name Provided";
                      let lname = rowData.userId
                        ? rowData.userId.lastname
                        : "No Last Name Provided";
                      return fname.concat(" ", lname);
                    }}
                  />
                  <Column header="Update Status" body={this.actionTemplate} />
                </DataTable>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default viewRequests;
