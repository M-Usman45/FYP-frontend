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
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.getcomplains();
  }
  getcomplains() {
    this.setState({ complains: null });
    compService
      .getUserComplains()
      .then((result) => {
        this.setState({ complains: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Accessing User Complains failed!",
          detail: "Server Error!",
        });
      });
  }

  onEdit(rowData, column) {
    console.log("Edit Button", rowData._id);
    return (
      <div>
        <Link
          to={{
            pathname: "/editComplain",
            state: {
              id: rowData._id,
            },
          }}
        >
          <Button
            type="button"
            //icon="pi pi-pencil"
            disabled={rowData.status === "approved" ? true : false}
            label="Edit"
            className="p-button-primary"
          ></Button>
        </Link>
      </div>
    );
  }
  onDelete(data) {
    let { complains } = this.state;
    const orignalcomplains = complains;
    complains = complains.filter((m) => m._id !== data._id);
    this.setState({ complains: complains });

    compService
      .deleteComp(data._id)
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Deleted Complain Successfully!",
        });
      })
      .catch((err) => {
        alert(err);
        this.setState({ complains: orignalcomplains });
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Complain is not deleted due to Server Error!",
        });
      });
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
                    header="Complain Title"
                    filter={true}
                    body={(rowData) => {
                      return (
                        <div>
                          <DialogProfile
                            type="userComplains"
                            _id={rowData._id}
                          />
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
                            rowData.status === "approved" ? true : false
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

export default viewComplains;
