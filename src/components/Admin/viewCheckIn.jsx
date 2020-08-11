import React, { Component } from "react";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Growl } from "primereact/growl";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import * as checkInService from "../../service/checkInService";

class ViewCheckIn extends Component {
  constructor() {
    super();
    this.state = {
      checkIns: null,
    };
    this.getcheckIns = this.getcheckIns.bind(this);
  }

  componentDidMount() {
    this.getcheckIns();
  }
  getcheckIns() {
    this.setState({ checkIns: null });
    checkInService
      .viewCheckIns()
      .then((result) => {
        this.setState({ checkIns: result.data });
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

  renderButton = (rowData , column)=>{
    
     return <Button label="Checked" onClick={()=>this.checkedHandler(rowData,column)} />
  }

  checkedHandler = (rowData , column)=>{
    let {checkIns} = this.state
    const orignalCheckIns = checkIns
    checkIns = checkIns.filter(m=> m.id !== rowData._id)
    checkInService.setChecked(rowData._id , rowData.asset.title)
    .then((result)=>{
      this.growl.show({
        life: "3000",
        severity: "success",
        summary: "Checked Successfully!",
      });
      this.setState({checkIns : checkIns})
    })
    .catch((err)=>{
      this.growl.show({
        life: "3000",
        severity: "error",
        summary: "Server error!",
      });
      this.setState({checkIns : orignalCheckIns})
    })
  }

  render() {
    const { checkIns } = this.state;
    let paginatorLeft = (
      <Button
        icon="pi pi-refresh"
        onClick={() => {
          this.getcheckIns();
        }}
      />
    );
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />

        <div style={{ textAlign: "center" }}>
          {!checkIns && (
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="#EEEEEE"
              animationDuration=".5s"
            />
          )}
          {checkIns && (
            <React.Fragment>
              <div className="content-section implementation">
                <DataTable
                  value={checkIns}
                  paginator={true}
                  autoLayout={true}
                  responsive={true}
                  paginatorLeft={paginatorLeft}
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                >
                  <Column
                    header="Asset Title"
                    body={(rowData, column) => {
                      return <div>{rowData.asset.title}</div>;
                    }}
                  />
                  <Column
                    header="Asset Brand"
                    body={(rowData, column) => {
                      return <div>{rowData.asset.brand}</div>;
                    }}
                  />
                  <Column
                     header="Return Date"
                     body={(rowData, column) => {
                      return (
                         <div>
                             {moment(rowData.returnDate).format("DD-MM-YYYY")}
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
                    header="User Email"
                    body={(rowData, column) => {
                      return rowData.user
                        ? rowData.user.email
                        : "No Last email Provided";
                    }}
                  />
                  <Column
                    header="Department"
                    body={(rowData, column) => {
                      return rowData.user
                        ? rowData.user.department
                        : "No Last email Provided";
                    }}
                  />
                  <Column body={ this.renderButton } />
                </DataTable>
              </div>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ViewCheckIn;
