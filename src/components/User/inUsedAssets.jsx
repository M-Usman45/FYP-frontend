import React, { Component } from "react";
import moment from "moment";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Growl } from "primereact/growl";
import * as assetService from "../../service/assetService";
import { ProgressSpinner } from "primereact/progressspinner";

class getInUsedAssets extends Component {
  constructor() {
    super();
    this.state = {
      assets: null,
    };
    this.getInUsedAssets = this.getInUsedAssets.bind(this);
    this.onReturn = this.onReturn.bind(this);
  }

  componentDidMount() {
    this.getInUsedAssets();
  }
  getInUsedAssets() {
    // const token = localStorage.getItem("token");
    this.setState({ assets: null });
    assetService
      .inUsedAssets()
      .then((result) => {
        this.setState({ assets: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Accessing User Assets failed!",
          detail: "Server error!",
        });
      });
  }
  onReturn(data) {
    let { assets } = this.state;
    const orignalassets = assets;
    assets = assets.filter((m) => m._id !== data._id);
    this.setState({ assets: assets });

    assetService
      .returnAsset(data._id)
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Success Message",
          detail: "Returned Asset Successfully!",
        });
        setTimeout(function () {
          window.location = "#/inUsedAssets";
        }, 1000);
      })
      .catch((err) => {
        this.setState({ assets: orignalassets });
        this.growl.show({
          life: "2000",
          severity: "error",
          summary: "Returning Asset Failed",
          detail: "Server Error!",
        });});
  }

  render() {
    const { assets } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getInUsedAssets();
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
                      alt=""/>
                  }} />
                <Column field="title" header="Asset Title" filter={true} />
                <Column field="brand" header="Asset Brand" filter={true} />
                <Column
                  header="Issue Date"
                  body={(rowData, column) => {
                    return (
                      <div>
                        {moment(rowData.users[0].issueDate).format(
                          "YYYY-MM-DD"
                        )}
                      </div>
                    );
                  }}
                />
                <Column
                  header="Return Date"
                  body={(rowData, column) => {
                    return (
                      <div>
                        {moment(rowData.users[0].returnDate).format(
                          "YYYY-MM-DD"
                        )}
                      </div>
                    );
                  }}
                />
                <Column
                  header="Return Asset"
                  body={(rowData) => {
                    return (
                      <Button
                        type="button"
                        //icon="pi pi-pencil"
                        label="Return"
                        className="p-button-primary"
                        onClick={() => this.onReturn(rowData, Column)}
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

export default getInUsedAssets;
