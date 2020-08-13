import React, { Component } from "react";
import Joi from "joi-browser";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {FileUpload} from 'primereact/fileupload';
import { Dialog } from "primereact/dialog";
import * as assetService from "../../service/assetService";
import AddCategory from "./addCategory";
import * as categoryService from "../../service/categoryService";
export class AddAsset extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      category:"",
      selectedFile:"",
      assetImage:"",
      categories:[],
      quantity: null,
      date: null,
      error: "",
      dialogVisibility: false
    };
    //  this.onTitleChange = this.onTitleChange.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount(){
       categoryService
        .viewCategories()
          .then(result=>{
             this.setState({categories : result.data})
             console.log(result.data)
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
  schema = {
    title: Joi.string().required().label("Title"),
    brand: Joi.string().required().label("Brand"),
    category: Joi.string().required().label("Category"),
    price: Joi.number().required().label("Price"),
    purchaseDate: Joi.date().required().label("Purchase Date"),
    quantity: Joi.number().required().min(1).label("quantity"),
    assetImage: Joi.string().required().label("Asset Image")
  };
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
  async onSubmit() {
    const { data,  date , category } = this.state;
    data["purchaseDate"] = date;
    data["category"] = category.name;
    const errors = this.validate(this.schema);
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
        data.assetImage,
        data.purchaseDate,
        data.category
      )
      .then((result) => {
        this.growl.show({
          severity: "success",
          summary: "Asset added Successfully!",
        });
        setTimeout(function () {
          window.location = "#/viewAssets";
        }, 1000);
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
  imageUploadHandler=(event)=>{
    const {data } = this.state;
    this.setState({assetImage: event.xhr.response})
    data["assetImage"] = event.xhr.response; 
      this.setState({data})
  }
  renderCategoryDailog = ()=>{
    this.setState({dialogVisibility: true})
  }
  dialogHide= ()=>{
    this.setState({dialogVisibility : false})
  }

  render() {
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <Dialog
            header={"Add New Category of Assets"}
            visible={this.state.dialogVisibility}
            style={{width:"500px"}}
            footer={<div style={{ height: "25px" }}></div>}
            //dismissableMask={true}
            blockScroll={false}
            onHide={this.dialogHide}
            //maximizable={true}
          >
            <AddCategory />
          </Dialog>    
        <div className="p-fluid">
          <div className="card card-w-title">
            <h1>Add New Asset</h1>
        <div className="p-grid">
          <div className="p-col-12 p-md-8" >
            <div className="p-grid" >
              <div className="p-sm-12 p-md-3">
                <label htmlFor="title">Asset Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText id="title" name="title" onChange={this.onChange} />
                {this.state.error["title"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["title"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid" >  
                   <div className="p-sm-12 p-md-3">
                      <label htmlFor="assetImage">Image</label>
                   </div>
                </div>
                <div className="p-grid" >  
                   <div className="p-col-12 p-md-8">
                        <FileUpload   
                              name="assetImage" 
                              auto={true}
                              onUpload={this.imageUploadHandler}
                              url="http://localhost:4000/api/admin/assets/uploads"
                              mode="basic" 
                              accept="image/*"
                              />
                   {this.state.error["assetImage"] && (
                      <span style={{ color: "red" }}>
                         {this.state.error["assetImage"]}
                       </span>
                       )}
                   </div>
                   {this.state.assetImage && (
                  <div className="p-col-12 p-md-8" style={{textAlign:"center"}}>
                    <image style={{maxHeight: '400px', width:'100%'}}
                    src={"http://localhost:4000/public/uploads/"+ this.state.assetImage}
                    alt={"Image not found"}/>
                  </div>
                )} 
                </div>
            <div className="p-grid">
              <div className="p-sm-12 p-md-3">
                <label htmlFor="brand">Asset Brand</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText id="brand" name="brand" onChange={this.onChange} />
                {this.state.error["brand"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["brand"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-sm-12 p-md-3">
                <label htmlFor="assetTitle">Asset Category</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8" style={{float:"left"}}>
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
              <div className="p-sm-12 p-md-3">
                <label htmlFor="price">Price</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-8">
                <InputText id="price" name="price" onChange={this.onChange} />
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
                  dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={this.state.date}
                  onChange={(event) => {
                    const { error} = this.state;
                    const obj = {
                      name: "purchaseDate",
                      value: event.value,
                    };
                    this.setState({ date: event.value });
                    console.log(event.value)
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
                <Button label="Add" onClick={this.onSubmit} />
              </div>
            </div>     
          </div>
          <div className='p-col-12 p-md-4'>
                <Button 
                  label="Add Category" 
                  onClick={this.renderCategoryDailog} />                
          </div>
        </div>
     </div>
   </div>
     
      </React.Fragment>
    );
  }
}

export default AddAsset;
