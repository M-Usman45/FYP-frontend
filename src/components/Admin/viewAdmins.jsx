import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Growl } from "primereact/growl";
import * as adminService from "../../service/adminService";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import * as authService from "../../service/authService";
class viewAdmins extends Component {
  constructor() {
    super();
    this.state = {
      admins: null,
    };
    this.getadmins = this.getadmins.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  componentDidMount() {
    this.getadmins();
    console.log("View Admin", this.state.admins);
  }
  getadmins() {
    this.setState({ admins: null });
    adminService
      .viewAdmins()
      .then((result) => {
        this.setState({ admins: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        console.log("error");
      });
  }
  onRemove(data) {
    let { admins } = this.state;
    const orignaladmins = admins;
    admins = admins.filter((m) => m._id !== data._id);
    adminService
      .removeAdmin(data._id)
      .then((result) => {
        this.growl.show({
          severity: "success",
          summary: "Admin Removed Successfully!",
        });
        this.setState({ admins: admins });
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Removing Admin failed!",
          detail: "Your can not remove the approved admin",
        });
        this.setState({ admins: orignaladmins });
      });
  }

  render() {
    const jwt = authService.getCurrentUser();
    const { admins } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getadmins();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />

        <div style={{ textAlign: "center" }}>
          {!admins && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {admins && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={admins}
                  paginator={true}
                  responsive={true}
                  autoLayout={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    header="Name"
                    filter={true}
                    body={(rowData) => {
                      let fname = rowData.firstname;
                      let lname = rowData.lastname;
                      return fname.concat(" ", lname);
                    }}
                  />

                  <Column field="email" filter={true} header="Email" />
                  <Column
                    field="department"
                    filter={true}
                    header="Department"
                  />
                  <Column field="contactno" header="Contact No" />
                  <Column
                    header="Delete"
                    body={(rowData) => {
                      return (
                        <Button
                          type="button"
                          label="Delete"
                          disabled={jwt.isApproved ? false : true}
                          className="p-button-danger"
                          onClick={() => this.onRemove(rowData)}
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

export default viewAdmins;
