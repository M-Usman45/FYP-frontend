import React, { Component } from "react";
import Joi from "joi-browser";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import * as assetService from "../../service/assetService";

class EditAsset extends Component {
  constructor() {
    super();
    this.state = {
      data: {title: "", brand:"", price:"", quantity:"", purchaseDate: null},
      category:"",
      error: "",
      date:null
    };
    this.onChange = this.onChange.bind(this);
  }
  
  schema = {
    price: Joi.number().required().label("Price"),
    purchaseDate: Joi.date().required().label("Purchase Date"),
    quantity: Joi.number().required().min(1).label("quantity"),
  };
  componentDidMount(){
    this.getAsset()
  }

  getAsset = ()=>{
    const id = this.props.location.state.id
    assetService.getAssetInfo(id)
    .then(result=>{
        this.setState({data : result.data })
        this.setState({ date: result.data.date})
        console.log("Edit Asset Componenet did mount", result.data)
    })
    .catch(err=>{
        console.log(err)
    })
}

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const Schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, Schema);

    return error ? error.details[0].message : null;
  };
  validate = (schema) => {
    const abort = {
      abortEarly: false,
    };
    const { error } = Joi.validate(this.state.data, schema, abort);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };
  onChange(e) {
    const data = { ...this.state.data };
    const error = { ...this.state.error };
    const { name, value } = e.currentTarget;
    const errorMessage = this.validateProperty(e.currentTarget , this.schema);
    if (errorMessage) error[name] = errorMessage;
    else delete error[name];
    data[name] = value;
    this.setState({ data, error });
  }
  imageUploadHandler=(event)=>{
    const {data } = this.state;
    this.setState({assetImage: event.xhr.response})
    data["assetImage"] = event.xhr.response; 
      this.setState({data})
  }

   onEdit = async ()=> {
    const { data,  date } = this.state;
    console.log("State Purchase date " , date)
    data["purchaseDate"] = date;
    console.log(data)
    const errors = this.validate();
    this.setState({ error: errors || {} });
    if (errors) {
      this.growl.show({
        life: "3000",
        severity: "error",
        summary: "Validation Error!",
      });
      return;
    }
    await assetService
      .editAsset(
        this.props.location.state.id,
        data.price,
        data.quantity,
        data.purchaseDate
      )
      .then((result) => {
        this.growl.show({
          severity: "success",
          summary: "Asset added Successfully!",
        });
        setTimeout(function () {
          window.location = "#/viewAsset";
        }, 2000);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Adding asset failed!",
          detail: "Server Error!",
        });
      });
  }

  render() {
    const {data } = this.state
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="card card-w-title">
            <h1>Edit Asset Details</h1>
        <div className="p-grid">
          <div className="p-col-12 p-md-8" >
          <div className="p-grid" >
              <div className="p-sm-12 p-md-3">
                <label htmlFor="title">Asset Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText id="title" name="title" value={data.title} disabled={true} />
              </div>
            </div>
            <div className="p-grid">
              <div className="p-sm-12 p-md-3">
                <label htmlFor="brand">Asset Brand</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText id="brand" name="brand" value={data.brand} disabled={true}/>
              </div>
            </div>
            <div className="p-grid" >  
                   <div className="p-sm-12 p-md-3">
                      <label htmlFor="assetImage">Image</label>
                   </div>
                </div>
                {data.assetImage &&(
                <div className="p-grid" >  
                  <div className="p-col-12 p-md-8" style={{textAlign:"center"}}>
                    <img style={{maxHeight: '400px', width:'100%'}}
                    src={"http://localhost:4000/public/uploads/"+ data.assetImage}
                    alt={"Image not found"}/>
                  </div>
                </div>
                )}
            <div className="p-grid">
              <div className="p-sm-12 p-md-3">
                <label htmlFor="price">Price</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText id="price" name="price" value={data.price} onChange={this.onChange} />
                {this.state.error["price"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["price"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-sm-12 p-md-3">
                <label htmlFor="spinner">Quantity</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText
                  id="quantity"
                  name="quantity"
                  onChange={this.onChange}
                  value={data.quantity}
                />
                {this.state.error["quantity"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["quantity"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
             <div className="p-sm-12 p-md-3">
                <label htmlFor="calendar">Purchase Date</label>
              </div> 
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <Calendar
                  id="date"
                  showButtonBar={true}
                  // dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={data.purchaseDate}
                  onChange={(event) => {
                    const { error} = this.state;
                    const obj = {
                      name: "purchaseDate",
                      value: event.value,
                    };
                    this.setState({ date: event.value });
                    console.log(this.state.date)
                    const errorMessage = this.validateProperty(obj);
                    if (errorMessage) error["purchaseDate"] = errorMessage;
                    else delete error["purchaseDate"];
                    this.setState({ error });
                  }}
                />
                {this.state.error["purchaseDate"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["purchaseDate"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <Button label="Edit" onClick={this.onEdit} />
              </div>
            </div>     
          </div>
        </div>
     </div>
   </div>
     
      </React.Fragment>
    );
  }
}

export default EditAsset;
