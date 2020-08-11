import React, { Component } from 'react';
import { Growl } from "primereact/growl";
import Joi from "joi-browser";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import * as categoryService from "../../service/categoryService";

class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: "",
            error: ""
          }
         this.onChange = this.onChange.bind(this) 
    }
    schema = {
        category: Joi.string().required().label("Category"),
     }
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

      validateProperty = ({ name, value } , schema ) => {
        const obj = { [name]: value };
        const Schema = { [name]: schema[name] };
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
      onAddCategory = async ()=> {
        const {data} = this.state
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
        await categoryService
         .addCategory(data.category)
            .then(result=>{
              this.growl.show({
                severity: "success",
                summary: "Category added Successfully!",
              });         
            })
            .catch(err=>{
              this.growl.show({
                life: "3000",
                severity: "error",
                summary: "Adding Category failed!",
                detail: "Server Error!",
              });          
            })
      }
    
    render() { 
        return (
            <React.Fragment>
            <Growl ref={(el) => (this.growl = el)} />     
            <div className=" p-grid">
            <div className="p-col-12">
               <label htmlFor="title">Asset Category</label>  
            </div>
            <div className="p-col-12">
              <InputText
                className="p-col-12"
                id="category" 
                name="category"
                placeholder="Enter Category of Asset"
                onChange={this.onChange}
              />
              {this.state.error["category"] && (
                  <span style={{ color: "red" }}>
                  {this.state.error["category"]}
              </span>
              )}                   
            </div>
            <div className="p-col-12">
              <Button className="p-col-12"  label= "Add" onClick={this.onAddCategory}/>
            </div>
        </div>
</React.Fragment>
         );
    }
}
 
export default AddCategory;