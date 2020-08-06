import React, { Component } from "react";
import Joi from "joi-browser";
import { Growl } from "primereact/growl";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import * as reqService from "../../service/reqService";
import * as assetService from "../../service/assetService";
import * as authService from "../../service/authService";
import * as categoryService from "../../service/categoryService";
export class SendRequest extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      assets: [],
      category:"",
      categories:[],
      asset: "",
      error: "",
      issueDate: null,
      returnDate: null,
    };
    //  this.onTitleChange = this       .onTitleChange.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  schema = {
    title: Joi.string().required().label("Title"),
    AssetTitle: Joi.string().required().label("Asset Title"),
    issueDate: Joi.date().required().label("Issue Date"),
    returnDate: Joi.date().required().label("Return Date"),
    category: Joi.string().required().label("Category"),
    description: Joi.string().max(200).required().label("Description"),
  };
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
    const { data,category, issueDate, returnDate, asset } = this.state;
    data["issueDate"] = issueDate;
    data["returnDate"] = returnDate;
    data["AssetTitle"] = asset.title;
    data["category"] = category.name;
    console.log("on Submit button", data);
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
    await reqService
      .sendRequest(
        data.title,
        data.AssetTitle,
        data.issueDate,
        data.returnDate,
        data.description,
        data.category
      )
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Request sended Successfully!",
        });
        setTimeout(function () {
          window.location = "#/userRequests";
        }, 2000);
        //this.setState({ data: {} });
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  componentDidMount() {
    this.getCategory()
    this.getAsset()
  }
  getAsset = () =>{
    assetService
      .getAssetTitles()
      .then((result) => {
        this.setState({ assets: result.data });
        console.log("Assets from backend" , result.data)
      })
      .catch((error) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Accessing Asset Titles failed ",
        });
      });
  }
  getCategory = ()=>{
    categoryService
    .viewCategories()
      .then(result=>{
         this.setState({categories : result.data})
         console.log("Categories Array" , this.state.categories)
      })
     .catch(err=>{
       this.growl.show({
         life: "3000",
         severity: "error",
         summary: "Getting Categories Failld!",
         detail: "Server Error!",
       });           
     })
  }
  render() {
    const jwt = authService.getCurrentUser();
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="card card-w-title">
            <h1>Send Request For Asset</h1>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="title">Request Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputText id="title" name="title" onChange={this.onChange} />
                {this.state.error["title"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["title"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="title">Asset Category</label>
              </div>
            </div>            
            <div className="p-grid">
              <div className="p-col-12 p-md-4" style={{float:"left"}}>
                <Dropdown
                  optionLabel="name"
                  value={this.state.category}
                  placeholder="Select Category of Asset"
                  options={this.state.categories}
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "category",
                      value: event.value.name,
                    };
                    this.setState({ category: event.value});
                    // console.log("Asset", this.state.asset);
                    const errorMessage = this.validateProperty(obj);
                    if (errorMessage) error["category"] = errorMessage;
                    else delete error["category"];
                    this.setState({ error });
                  }}
                />
                {this.state.error["category"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["category"]}
                  </span>
                )}
              </div>  
            </div>            
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="assetTitle">Asset Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Dropdown
                  optionLabel="title"
                  value={this.state.asset}
                  placeholder="Select an Asset"
                  options={this.state.assets}
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "AssetTitle",
                      value: event.value.title,
                    };
                    this.setState({ asset: event.value });
                    const errorMessage = this.validateProperty(obj);
                    if (errorMessage) error["AssetTitle"] = errorMessage;
                    else delete error["AssetTitle"];
                    this.setState({ error });
                  }}
                />
                {this.state.error["AssetTitle"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["AssetTitle"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="description">Description</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputTextarea
                  name="description"
                  rows={5}
                  cols={30}
                  // value={this.state.description}
                  onChange={this.onChange}
                  autoResize={true}
                />
                {this.state.error["description"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["description"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="calendar">Issue Date</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Calendar
                  id="calendar"
                  showButtonBar={true}
                  dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={this.state.issueDate}
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "issueDate",
                      value: event.value,
                    };
                    this.setState({ issueDate: event.value });
                    const errorMessage = this.validateProperty(obj);
                    if (errorMessage) error["issueDate"] = errorMessage;
                    else delete error["issueDate"];
                    this.setState({ error });
                  }}
                />
                {this.state.error["issueDate"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["issueDate"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="calendar">Return Date</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Calendar
                  id="returnDate"
                  showButtonBar={true}
                  dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={this.state.returnDate}
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "returnDate",
                      value: event.value,
                    };
                    this.setState({ returnDate: event.value });
                    const errorMessage = this.validateProperty(obj);
                    if (errorMessage) error["returnDate"] = errorMessage;
                    else delete error["returnDate"];
                    this.setState({ error });
                  }}
                />
                {this.state.error["returnDate"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["returnDate"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Button
                  label="Send"
                  disabled={jwt.isApproved ? false : true}
                  onClick={this.onSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SendRequest;
