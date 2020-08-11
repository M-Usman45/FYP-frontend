import React, { Component } from "react";
import Joi from "joi-browser";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Growl } from "primereact/growl";
import { InputText } from "primereact/inputtext";
import * as userService from "../../service/userService";
import * as authService from "../../service/authService";

export class ViewProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:{
        firstname:"",
        lastname:"",
        contactno:""
      },
      error:"",
      user:{},
      profileVisible: false,
      PasswordVisible: false,
    };
    this.onChange = this.onChange.bind(this);
    this.getdata = this.getdata.bind(this);
  }

  schema = {
    firstname: Joi.string().required().label("First Name"),
    lastname: Joi.string().required().label("Last Name"),
    contactno: Joi.number().required().label("Contact No"),
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

  onProfileEdit = ()=> {
    const { data } = this.state;
    const errors = this.validate();
    this.setState({ error: errors });
    if (errors) {
      console.log("In validATION error" , data)
      console.log("validation error here " , errors)
      this.growl.show({
        life: "3000",
        severity: "error",
        summary: "Validation!",
      });
      return;
    }
    userService
      .editProfile(data._id , data.firstname, data.lastname, data.contact)
      .then((result) => {
        this.growl.show({
          severity: "success",
          summary: "Profile edited Successfully!",
        });
        setTimeout(function () {
          window.location = "#/viewProfileOfdata";
        }, 2000);
      })
      .catch((error) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Editing profile failed!",
          detail: "Server Error!",
        });
      });
  }

  componentDidMount() {
    this.getdata();
  }

  getdata() {
    const token = authService.getCurrentUser();
    console.log("View Profile Decoded id", token.id);
    userService
      .getUserInfo(token.id)
      .then((result) => {
        this.setState({user: result.data})
      })
      .catch((err) => {
        console.log("error");
      });
  }

  ProfileHide = () => {
    this.setState({ profileVisible: false });
  };

  PasswordHide = () => {
    this.setState({ PasswordVisible: false });
  };

  passwordDialog = () => {
      this.setState({ PasswordVisible: true})
  };

  profileDialog = () => {
    console.log("Profile Dialog");
    this.setState({ profileVisible: true });
  };

  render() {
    const { data , user} = this.state;
    // data["firstname"] = user["firstname"]
    // data["lastname"] = user["lastname"]
    // data["contactno"] = user["contactno"]

    return (
      <React.Fragment>
          <Growl ref={(el) => (this.growl = el)} />
          <Dialog
            header={"Edit Profile"}
            visible={this.state.profileVisible}
            style={{width:"500px"}}
            footer={<div style={{ height: "25px" }}></div>}
            //dismissableMask={true}
            blockScroll={false}
            onHide={this.ProfileHide}
            //maximizable={true}
          >
              <div className=" p-grid">
                  <div className="p-col-12">
                     <label htmlFor="title">First Name</label>  
                  </div>
                  <div className="p-col-12">
                    <InputText
                      className="p-col-12"
                      id="firstname"
                      name="firstname"
                      value={data.firstname}
                      placeholder="Enter your First Name"
                      onChange={this.onChange}
                    />
                    {this.state.error["firstname"] && (
                        <span style={{ color: "red" }}>
                        {this.state.error["firstname"]}
                    </span>
                    )}                   
                  </div>
                  <div className="p-col-12">
                     <label htmlFor="title">Last Name</label>  
                  </div>
                  <div className="p-col-12">
                    <InputText
                      className="p-col-12"
                      id="lastname"
                      value={data.lastname}
                      name="lastname"
                      placeholder="Enter your Last Name"
                      onChange={this.onChange}
                    />
                    {this.state.error["lastname"] && (
                        <span style={{ color: "red" }}>
                        {this.state.error["lastname"]}
                    </span>
                    )}                    
                  </div>
                  <div className="p-col-12">
                     <label htmlFor="title">Contact No</label>  
                  </div>
                  <div className="p-col-12">
                    <InputText
                      className="p-col-12"
                      value={data.contactno}
                      id="contactno"
                      name="contactno"
                      placeholder="Enter your Contact No"
                      onChange={this.onChange}
                    />
                    {this.state.error["contactno"] && (
                        <span style={{ color: "red" }}>
                        {this.state.error["contactno"]}
                    </span>
                    )}                    
                  </div>
                  <div className="p-col-12">
                    <Button
                      className="p-col-12"
                      label="Edit"
                      icon="pi pi-pencil"
                      onClick={this.onProfileEdit}
                    />
                  </div>
                </div>
          </Dialog>
          <Dialog
            header={"Change Password"}
            visible={this.state.PasswordVisible}
            style={{ width: "50vw" }}
            dismissableMask={true}
            blockScroll={false}
            onHide={this.PasswordHide}
            //maximizable={true}
          >
         </Dialog>
        <div className="p-fluid">
          {this.state.user && (
            <div className="p-grid">
              <div className="p-col-12">
                <div className="card card-w-firstname">
                  <h1>{user.firstname + " " + user.lastname}</h1>
                  <div className="p-grid">
                    <div className="p-col-6" style={{ float: "right" }}>
                      <div className="p-grid">
                        <div className="p-col-4">
                          <h4> First Name: </h4>
                        </div>
                        <div className="p-col-6" style={{ marginTop: "20px" }}>
                          {user.firstname}
                        </div>
                      </div>
                      <div className="p-grid">
                        <div className="p-col-4">
                          <h4> Last Name: </h4>
                        </div>
                        <div className="p-col-6" style={{ marginTop: "20px" }}>
                          {user.lastname}
                        </div>
                      </div>
                      <div className="p-grid">
                        <div className="p-col-4">
                          <h4> Email: </h4>
                        </div>
                        <div className="p-col-6" style={{ marginTop: "20px" }}>
                          {user.email}
                        </div>
                      </div>
                      <div className="p-grid">
                        <div className="p-col-4">
                          <h4> Department: </h4>
                        </div>
                        <div className="p-col-6" style={{ marginTop: "20px" }}>
                          {user.department}
                        </div>
                      </div>
                      <div className="p-grid">
                        <div className="p-col-4">
                          <h4> Contact no </h4>
                        </div>
                        <div className="p-col-6" style={{ marginTop: "20px" }}>
                          {user.contactno}
                        </div>
                      </div>
                      <div className="p-grid">
                        <div className="p-col-4">
                          <Button
                            label="Edit Profile"
                            icon="pi pi-pencil"
                            onClick={this.profileDialog}
                          />
                        </div>
                        <div className="p-col-5">
                          <Button
                            label="Change Password"
                            icon="pi pi-pencil"
                            onClick={this.passwordDialog}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ViewProfile;
