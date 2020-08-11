import React, { Component } from "react";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Growl } from "primereact/growl";
import * as compService from "../../service/compService";
import { Button } from "primereact/button";
import DialogProfile from "../common/dialogProfile";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

class viewComplains extends Component {
  constructor() {
    super();
    this.state = {
      complains: null,
    };
    this.getcomplains = this.getcomplains.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
  }

  componentDidMount() {
    this.getcomplains();
  }
  getcomplains() {
    this.setState({ complains: null });
    compService
      .viewComplains()
      .then((result) => {
        this.setState({ complains: result.data });
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

  actionTemplate(rowData, column) {
    //console.log("Update Button", rowData._id)
    return (
      <div>
        <Link
          to={{
            pathname: "/complainStatus",
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
    const { complains } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getcomplains();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />

        <div style={{ textAlign: "center" }}>
          {!complains && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {complains && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={complains}
                  autoLayout={true}
                  paginator={true}
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
                        <div>
                          <DialogProfile type="complain" _id={rowData._id} />
                        </div>
                      );
                    }}
                  />
                  <Column
                    field="description"
                    filter={true}
                    header="Description"
                  />
                  <Column field="status" filter={true} header="Status" />
                  <Column
                    filter={true}
                    header="User"
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
                  <Column
                    //filter={true}
                    header="Send Date"
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.sendDate).format("YYYY-MM-DD")}
                        </div>
                      );
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

export default viewComplains;
