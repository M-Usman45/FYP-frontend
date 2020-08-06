import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Growl } from "primereact/growl";
import { Column } from "primereact/column";
import * as userService from "../../service/userService";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

class viewUsers extends Component {
  constructor() {
    super();
    this.state = {
      users: null,
    };
    this.getusers = this.getusers.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
  }

  componentDidMount() {
    this.getusers();
  }
  getusers() {
    this.setState({ users: null });
    userService
      .getUsersRequest()
      .then((result) => {
        this.setState({ users: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Geting user's requests!",
          detail: "Server Error!",
        });
      });
  }
  actionTemplate(rowData, column) {
    console.log("Update Button", rowData._id);
    return (
      <div>
        <Link
          to={{
            pathname: "/approveUser",
            state: {
              id: rowData._id,
            },
          }}
        >
          <Button
            type="button"
            label="Approve"
            //icon="pi pi-pencil"
            className="p-button-primary"
          ></Button>
        </Link>
      </div>
    );
  }

  render() {
    const { users } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getusers();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div style={{ textAlign: "center" }}>
          {!users && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {users && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={users}
                  paginator={true}
                  autoLayout={true}
                  responsive={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    header="User Name"
                    body={(rowData) => {
                      let fname = rowData.firstname;
                      let lname = rowData.lastname;
                      return fname.concat(" ", lname);
                    }}
                    filter={true}
                  />
                  <Column field="email" filter={true} header="Email" />
                  <Column
                    field="department"
                    filter={true}
                    header="Department"
                  />
                  <Column field="contactno" filter={true} header="Contact No" />
                  <Column header="Approve User" body={this.actionTemplate} />
                </DataTable>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default viewUsers;
