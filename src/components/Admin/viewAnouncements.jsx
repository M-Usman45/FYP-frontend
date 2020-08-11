import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Growl } from "primereact/growl";
import * as anounceService from "../../service/anounceService";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
class ViewAnouncements extends Component {
  constructor() {
    super();
    this.state = {
      anouncements: null,
    };
    this.getanouncements = this.getanouncements.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  componentDidMount() {
    this.getanouncements();
    console.log("View Admin", this.state.anouncements);
  }
  getanouncements() {
    this.setState({ anouncements: null });
    anounceService
      .viewAnouncements()
      .then((result) => {
        this.setState({ anouncements: result.data });
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
  onRemove(data) {
    let { anouncements } = this.state;
    const orignalanouncements = anouncements;
    anouncements = anouncements.filter((m) => m._id !== data._id);
    anounceService
      .removeAnounce(data._id)
      .then((result) => {
        this.setState({ anouncements: anouncements });
        this.growl.show({
          severity: "success",
          summary: "Anouncement Deketed Successfully!",
        });
      })
      .catch((err) => {
        alert(err);
        this.setState({ anouncements: orignalanouncements });
      });
  }

  render() {
    const { anouncements } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getanouncements();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div style={{ textAlign: "center" }}>
          {!anouncements && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {anouncements && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={anouncements}
                  paginator={true}
                  responsive={true}
                  autoLayout={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column field="title" filter={true} header="Title" />
                  <Column
                    field="description"
                    //filter={true}
                    header="Description"
                  />
                  <Column
                    header="Delete"
                    body={(rowData) => {
                      return (
                        <Button
                          type="button"
                          label="Delete"
                          //icon="pi pi-pencil"
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

export default ViewAnouncements;
