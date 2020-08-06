import React, { Component } from "react";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import * as checkOutService from "../../service/checkOutService";

class ViewCheckOuts extends Component {
  constructor() {
    super();
    this.state = {
      checkOuts: null,
    };
    this.getcheckOuts = this.getcheckOuts.bind(this);
  }

  componentDidMount() {
    this.getcheckOuts();
  }
  getcheckOuts() {
    this.setState({ checkOuts: null });
    checkOutService
      .viewCheckOuts()
      .then((result) => {
        this.setState({ checkOuts: result.data });
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

  render() {
    const { checkOuts } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getcheckOuts();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />

        <div style={{ textAlign: "center" }}>
          {!checkOuts && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {checkOuts && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={checkOuts}
                  paginator={true}
                  autoLayout={true}
                  responsive={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    header="Asset Title"
                    field="assetTitle"
                  />
                  <Column
                    header="Issue Date"
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.issueDate).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      );
                    }}
                  />

                  <Column
                    header="Return Date "
                    //filter={true}
                    body={(rowData, column) => {
                      return (
                        <div style={{ width: "80px" }}>
                          {moment(rowData.returnDate).format(
                            "DD-MM-YYYY"
                          )}
                        </div>
                      );
                    }}
                  />
                  <Column
                    //filter={true}
                    header="Username"
                    body={(rowData) => {
                      let fname = rowData.user
                        ? rowData.user.firstname
                        : "No First Name Provided";
                      let lname = rowData.user
                        ? rowData.user.lastname
                        : "No Last Name Provided";
                      return fname.concat(" ", lname);
                    }}
                  />
                  <Column
                    header="User's Email"
                    body={(rowData, column) => {
                      return <div>{rowData.user.email}</div>;
                    }}
                  />
                  <Column
                    header="Department"
                    body={(rowData, column) => {
                      return <div>{rowData.user.department}</div>;
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

export default ViewCheckOuts;
