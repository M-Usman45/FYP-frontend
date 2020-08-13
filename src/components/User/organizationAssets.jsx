import React, { Component } from "react";
import { Growl } from "primereact/growl";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as assetService from "../../service/assetService";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Link } from "react-router-dom";

class OrganizationAssets extends Component {
  constructor() {
    super();
    this.state = {
      assets: null,
    };
    this.getOrganizationAssets = this.getOrganizationAssets.bind(this);
  }

  componentDidMount() {
    this.getOrganizationAssets();
  }
  getOrganizationAssets() {
    this.setState({ assets: null });
    assetService
      .OrganizationAssets()
      .then((result) => {
        this.setState({ assets: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Accessing Organization failed ",
          detail: "Server error!",
        });
      });
  }

  sendReq(rowData, column) {
    //console.log("Update Button", rowData._id)
    return (
      <div>
        <Link
          to={{
            pathname: "/sendRequest",
            state: {
              id: rowData.title,
            },
          }}
        >
          <Button
            type="button"
            //icon="pi pi-pencil"
            label="Send"
            className="p-button-primary"
          ></Button>
        </Link>
      </div>
    );
  }

  render() {
    const { assets } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getOrganizationAssets();
        }}
      />
    );
    // let paginatorRight = <Button icon="pi pi-cloud-upload" />;
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div style={{ textAlign: "center" }}>
          {!assets && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {assets && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={assets}
                  paginator={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column header="Image" body={(rowData , column)=>{
                    return <img 
                       style={{height: "50px" , width:"50px" , borderRadius:"15ch", textAlign:"center"}}  
                       src={"http://localhost:4000/public/uploads/"+rowData.assetImage} 
                      alt="not found"/>
                  }} />
                  <Column field="title" header="Title" filter={true} />
                  <Column field="brand" header="Brand" />
                  <Column field="category" header="Category" /> 
                  <Column
                    header="Available"
                    body={(rowData) => {
                      if (rowData.quantity >= 1) return "Yes";
                      else return "No";
                    }}
                  />
                  <Column header="Send Request" body={this.sendReq} />
                </DataTable>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default OrganizationAssets;
