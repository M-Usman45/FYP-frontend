import React, {Component} from'react';
import moment from "moment"
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { Growl } from "primereact/growl";
import * as reqService from "../../service/reqService";
import * as compService from "../../service/compService";
import * as assetService from "../../service/assetService";
import * as userService from "../../service/userService";

export default class Repoerts extends Component {

constructor() {
  super();
  this.state= {
    months: [ {month:'January' , value: "01" },
              {month:'February', value: "02"}, 
              {month:'March' , value: "03"},
              {month: 'April', value: "04"}, 
              {month:'May' , value: "05"}, 
              {month:'June', value: "06"}  ,
              {month:'July', value: "07"},
              {month:'August', value: "08"},
              {month:'September' , value: "09"},
              {month:'October' , value: "10"},
              {month:'November', value: "11"},
              {month:'December', value: "12"},
            ],
    requests:"",
    month:{},
    complains:"",
    assets:""
  }
}
  componentDidMount(){
    this.getrequests()
    this.getcomplains()
    this.getAssets()
    this.getusers()
    // console.log(this.state.users)
  }
  getrequests = ()=> {
    this.setState({ requests: null });
    reqService
      .viewRequests()
      .then((result) => {
        this.setState({ requests: result.data });
        // console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  getusers =()=> {
    this.setState({ users: null });
    userService
      .getUsersRequest()
      .then((result) => {
        this.setState({ users: result.data });
        // console.log(result.data);
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
  getcomplains = ()=> {
    this.setState({ complains: null });
    compService
      .viewComplains()
      .then((result) => {
        this.setState({ complains: result.data });
        // console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  getAssets = ()=> {
    this.setState({ assets: null });
    assetService
      .viewAssets()
      .then((result) => {
        this.setState({ assets: result.data });
        // console.log(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }

  renderRequests = ()=> {
      return(
      <DataTable 
        value={this.state.requests}
        paginator={true}
        responsive={true}
        autoLayout={true}
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}> 
          <Column field="title" header="Title" />
          <Column field="assetTitle" header="Requested Asset" /> 
          <Column field="status" header="Status" />
          <Column header="Send Date"
            body={(rowData, column) => <div style={{ width: "80px" , textAlign:"center" }}>  
              {moment(rowData.sendDate).format("YYYY-MM-DD")}  </div>} />
          <Column header="Username"
            body={(rowData) => {
             let fname = rowData.userId
            ? rowData.userId.firstname
            : "No First Name Provided";
            let lname = rowData.userId
            ? rowData.userId.lastname
            : "No Last Name Provided";
          return fname.concat(" ", lname); }} />
      </DataTable> )
  }

  renderComplains = ()=> {
    return(
    <DataTable 
      value={this.state.complains}
      paginator={true}
      responsive={true}
      autoLayout={true}
      rows={5}
      rowsPerPageOptions={[5, 10, 20]}> 
        <Column field="title" header="Title" />
        <Column field="status" header="Status" />
        <Column header="Send Date"
          body={(rowData, column) => <div style={{ width: "80px" , textAlign:"center" }}>  
            {moment(rowData.sendDate).format("YYYY-MM-DD")}  </div>} />
        <Column header="Username"
          body={(rowData) => {
           let fname = rowData.userId
          ? rowData.userId.firstname
          : "No First Name Provided";
          let lname = rowData.userId
          ? rowData.userId.lastname
          : "No Last Name Provided";
        return fname.concat(" ", lname); }} />
    </DataTable> )
}

  renderAssets =()=>{
    return (
      <DataTable
        value={this.state.assets}
        paginator={true}
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
        responsive={true} >
        <Column header="Image" body={(rowData , column)=>{
           return <img style={{height: "50px" , width:"50px" , borderRadius:"15ch"}}  
              src={"http://localhost:4000/public/uploads/"+rowData.assetImage} 
              alt = ""/>  }} />
        <Column field="title" header="Title"/>
        <Column field="price" header="Price" />
        <Column field="category" header="Category" /> 
        <Column
          header="Purchase Date"
            body={(rowData, column) => <div> {moment(rowData.purchaseDate).format("DD-MM-YYYY")} </div> } />
      </DataTable> );
   }

   renderUsers =()=>{
    return (
    <DataTable
    value={this.state.users}
    paginator={true}
    autoLayout={true}
    responsive={true}
    rows={5}
    rowsPerPageOptions={[5, 10, 20]}>
    <Column
      header="User Name"
      body={(rowData) => {
        let fname = rowData.firstname;
        let lname = rowData.lastname;
        return fname.concat(" ", lname);
      }} />
    <Column field="email" header="Email" />
    <Column field="department" header="Department"/>
    <Column field="contactno" header="Contact No" />
    <Column header="Approved User" body={(rowData , column)=> rowData.isApproved ? "Approved" : "Not-Approved"} />
  </DataTable>);
   }

   handleChange= event=>{
      this.setState({ month: event.target.value})
      this.getRequestsReport(event.target.value.month)
      //this.getComplainsReport(event.target.value.month)
      // this.getAssetsReport(event.target.value.month)
   }
  
   getRequestsReport=(month)=>{
     reqService.getReqsReport(month)
       .then(result=>this.setState({requests:result.data}))
       .catch(err=>this.growl.show({
          life: "3000",
          severity: "error",
         summary: "Geting user's requests!",
         detail: "Server Error!"})
    )
   }

   getComplainsReport=(month)=>{
    compService.getCompsReport(month)
      .then(result=>this.setState({complains:result.data}))
      .catch(err=>this.growl.show({
         life: "3000",
         severity: "error",
        summary: "Geting user's requests!",
        detail: "Server Error!"})
   )
  }

  getAssetsReport=(month)=>{
    assetService.getAssetsReport(month)
      .then(result=>this.setState({assets:result.data}))
      .catch(err=>this.growl.show({
         life: "3000",
         severity: "error",
        summary: "Geting user's requests!",
        detail: "Server Error!"})
   )
  }


render() {
    const {requests , complains , assets} = this.state
    const spiner =<div style={{textAlign:"center"}}>           
      <ProgressSpinner
        style={{width: "100px", height: "100px" }}
        strokeWidth="8"
        fill="#EEEEEE"
        animationDuration=".5s"
      />
     </div>
  return(
    <React.Fragment> 
    <Growl ref={(el) => (this.growl = el)} />   
    <div className="p-grid p-fluid">
      <div className="p-col-12 p-lg-12">
        <div className="card">
          <h1> Reports </h1>
          <div className="p-grid">
            <div className="p-col-2 p-sm-12 p-md-2">
              <label htmlFor="title">Report's month</label>
            </div>
            <div className="p-col-3 p-md-3" >
              <Dropdown
                optionLabel="month"
                value={this.state.month}
                placeholder="Select month"
                options={this.state.months}
                onChange={this.handleChange}
               />
            </div>
        </div>
        <div className="p-col-12 p-lg-12">
          <div className="card" style={{border: "1px solid " , borderRadius: "2ch"}}>
            <h1 className="centerText">Requests</h1>
              {requests ? this.renderRequests()  :  spiner }
            </div>
        </div> 
        <div className="p-col-12 p-lg-12">
          <div className="card" style={{border: "1px solid" , borderRadius: "2ch"}}>
            <h1 className="centerText">Complains </h1>
              {complains ? this.renderComplains() : spiner }
            </div>        
        </div>
        <div className="p-col-12 p-lg-12">
          <div className="card" style={{border: "1px solid" , borderRadius: "2ch"}}>
            <h1 className="centerText">Purchased Assets </h1>
              {assets ? this.renderAssets() : spiner }
            </div>        
        </div> 
        <div className="p-col-12 p-lg-12">
          <div className="card" style={{border: "1px solid" , borderRadius: "2ch"}}>
            <h1 className="centerText">Approved Users </h1>
              {assets ? this.renderUsers() : spiner }
            </div>        
        </div> 
      </div>
    </div>
  </div>
  </React.Fragment>  
  )}
}


