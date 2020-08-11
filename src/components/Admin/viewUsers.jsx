import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as userService from "../../service/userService";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Growl } from "primereact/growl";

class viewUsers extends Component {
  constructor() {
    super();
    this.state = {
      users: null,
    };
    this.getusers = this.getusers.bind(this);
    //this.actionTemplate = this.actionTemplate.bind(this);
  }

  componentDidMount() {
    this.getusers();
  }
  getusers() {
    this.setState({ users: null });
    userService
      .viewUsers()
      .then((result) => {
        this.setState({ users: result.data });
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
                    //filter={true}
                  />
                  <Column field="email" filter={true} header="Email" />
                  <Column
                    field="department"
                    filter={true}
                    header="Department"
                  />
                  <Column field="contactno" filter={true} header="Contact No" />
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
