import React, { Component } from "react";
import Joi from "joi-browser";
import { InputText } from "primereact/inputtext";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import * as adminService from "../../service/adminService";

export class AddAdmin extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      error: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  schema = {
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    email: Joi.string().required().email().label("Email"),
    department: Joi.string().required().label("department"),
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

  onSubmit() {
    const { data} = this.state;
    const errors = this.validate();
    this.setState({ error: errors });
    if (errors) {
      this.growl.show({
        life: "3000",
        severity: "error",
        summary: "Validation!",
      });
      return;
    }
    adminService
      .addAdmin(data.firstname, data.lastname, data.email, data.department)
      .then((result) => {
        this.growl.show({
          severity: "success",
          summary: "Added Admin Successfully!",
        });
        setTimeout(function () {
          window.location = "#/viewAdmins";
        }, 2000);
      })
      .catch((error) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Adding admin failed!",
          detail: "Server Error!",
        });
      });
  }
  componentDidMount() {}
  render() {
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="card card-w-title">
            <h1>Add New Admin</h1>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="firstname">First Name</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputText
                  id="firstname"
                  name="firstname"
                  onChange={this.onChange}
                />
                {this.state.error["firstname"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["firstname"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="lastname">Last Name</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputText
                  id="lastname"
                  name="lastname"
                  onChange={this.onChange}
                />
                {this.state.error["lastname"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["lastname"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputText id="email" name="email" onChange={this.onChange} />
                {this.state.error["email"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["email"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="department">Department</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputText
                  id="department"
                  name="department"
                  onChange={this.onChange}
                />
                {this.state.error["department"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["department"]}
                  </span>
                )}
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Button label="Add" onClick={this.onSubmit} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AddAdmin;
