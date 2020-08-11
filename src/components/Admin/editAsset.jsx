import React, { Component } from "react";
import Joi from "joi-browser";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {FileUpload} from 'primereact/fileupload';
import * as assetService from "../../service/assetService";

export class EditAsset extends Component {
  constructor() {
    super();
    this.state = {
      data: {
         title:"",
         brand:"",
         price:"",
         quantity:"",
         purchaseDate:""
      },
      category:"",
      categories:[],
      quantity: null,
      date: null,
      error: "",
    };
    //  this.onTitleChange = this.onTitleChange.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  schema = {
    title: Joi.string().required().label("Title"),
    brand: Joi.string().required().label("Brand"),
    Category: Joi.string().required().label("Category"),
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
          this.setState({data : result.data})
          console.log("Edit Asset Componenet did mount", this.state.data)
      })
      .catch(err=>{
          console.log(err)
      })
  }

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };
  validate = () => {
    const abort = {
      abortEarly: false,
    };
    const { error } = Joi.validate(this.state.data, this.schema, abort);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  onChange(e) {
    const data = { ...this.state.data };
    const error = { ...this.state.error };
    const { name, value } = e.currentTarget;
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) error[name] = errorMessage;
    else delete error[name];
    data[name] = value;
    this.setState({ data, error });
  }

  async onSubmit() {
    const { data,  date } = this.state;
    data["purchaseDate"] = date;
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
      .addAssets(
        data.title,
        data.brand,
        data.price,
        data.quantity,
        this.state.date
      )
      .then((result) => {
        //alert("Asset added successfulu!!");
        //window.location = "#/addAsset";
        this.growl.show({
          severity: "success",
          summary: "Asset added Successfully!",
        });
        setTimeout(function () {
          window.location = "#/addAsset";
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
      const {data} = this.state
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="card card-w-title">
            <h1>Add New Asset</h1>
            <div className="p-grid" >
              <div className="p-col-12 p-md-2">
                <label htmlFor="title">Asset Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <InputText id="title" name="title" value={data.title} onChange={this.onChange} />
                {this.state.error["title"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["title"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid" >  
                   <div className="p-col-12 p-md-2">
                      <label htmlFor="image">Image</label>
                   </div>
                </div>
                <div className="p-grid" >  
                   <div className="p-col-12 p-md-6">
                        <FileUpload name="image" url="./upload" mode="advanced" accept=".image/*" />
                   </div>
                </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="brand">Asset Brand</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <InputText id="brand" name="brand" value={data.brand} onChange={this.onChange} />
                {this.state.error["brand"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["brand"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="assetTitle">Asset Category</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <Dropdown
                  optionLabel="title"
                  value={this.state.category}
                  placeholder="Select Category of Asset"
                  options={this.state.categories}
                  // name="title"
                  //optionLabel="title"
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "Category",
                      value: event.value.title,
                    };
                    this.setState({ category: event.value });
                    // console.log("Asset", this.state.asset);
                    const errorMessage = this.validateProperty(obj);
                    if (errorMessage) error["Category"] = errorMessage;
                    else delete error["Category"];
                    this.setState({ error });
                  }}
                />
                {this.state.error["Category"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["Category"]}
                  </span>
                )}
              </div>
              </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="price">Price</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <InputText id="price" name="price" value={data.price} onChange={this.onChange} />
                {this.state.error["price"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["price"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="spinner">Quantity</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <InputText
                  id="quantity"
                  name="quantity"
                  value={data.quantity}
                  onChange={this.onChange}
                />
                {this.state.error["quantity"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["quantity"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
             <div className="p-col-12 p-md-2">
                <label htmlFor="calendar">Purchase Date</label>
              </div> 
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-6">
                <Calendar
                  id="date"
                  showButtonBar={true}
                  dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={data.purchaseDate}
                  onChange={(event) => {
                    const { error} = this.state;
                    const obj = {
                      name: "purchaseDate",
                      value: event.value,
                    };
                    this.setState({ date: event.value });
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
              <div className="p-col-12 p-md-6">
                <Button label="Add" onClick={this.onSubmit} />
              </div>
            </div>
            </div>
            </div>
      </React.Fragment>
    );
  }
}

export default EditAsset;
