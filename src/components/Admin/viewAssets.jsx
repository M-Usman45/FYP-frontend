import React, { Component } from "react";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as assetService from "../../service/assetService";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

class viewAssets extends Component {
  constructor() {
    super();
    this.state = {
      assets: null,
    };
    this.getAssets = this.getAssets.bind(this);
  }

  componentDidMount() {
    this.getAssets();
  }
  getAssets() {
    this.setState({ assets: null });
    assetService
      .viewAssets()
      .then((result) => {
        this.setState({ assets: result.data });
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
  onEdit = (rowData , column)=>{
    return(
       <div> 
          <Link 
          to={{
               pathname: "/editAsset",
               state:{
                  id:rowData._id
               }
          }}>
          <Button type="button" className="p-btn-primary" icon="pi pi-pencil" />
          </Link>
       </div>
    )
  }
  render() {
    const { assets } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getAssets();
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
                  responsive={true}
                >
                  <Column header="Image" body={(rowData , column)=>{
                    const imageName = rowData.image
                     return <img 
                       style={{height: "100px" , width:"100px" , borderRadius:"15ch"}}  
                       src={"http://localhost:4000/public/uploads/"+imageName} 
                       alt = "image not fount"/>
                  }} />
                  <Column field="title" header="Title" filter={true} />
                  <Column field="brand" header="Brand" filter={true} />
                  <Column field="quantity" header="Quantity" />
                  <Column field="price" header="Price" />
                  <Column field="category" header="Category" /> 
                  <Column
                    header="Purchase Date"
                    //filter={true}
                    body={(rowData, column) => {
                      return (
                        <div>
                          {moment(rowData.purchaseDate).format("DD-MM-YYYY")}
                        </div>
                      );
                    }}
                  />
                  <Column header="Edit" body={this.onEdit}/>
                </DataTable>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default viewAssets;
