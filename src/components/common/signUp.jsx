import React, { Component } from "react";
import { Button } from "primereact/button";
import Joi from "joi-browser";
import { Growl } from "primereact/growl";
import * as authService from "../../service/authService";
import "../../login.css";
class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: { value: "" },
      data: {},
      invalid: false,
      loading: false,
      error: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  schema = {
    fname: Joi.string().required().label("First Name"),
    lname: Joi.string().required().label("Last Name"),
    email: Joi.string().required().email({ minDomainAtoms: 2 }).label("Email"),
    password: Joi.string().required().min(8).label("Password"),
    department: Joi.string().required().label("Department"),
    contact: Joi.number().required().label("Contact no"),
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
  onSubmit(e) {
    console.log("In submit button", this.state.data);
    e.preventDefault();
    const { data } = this.state;
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
    authService
      .UserSignUp(
        data.fname,
        data.lname,
        data.email,
        data.password,
        data.department,
        data.contact
      )
      .then((result) => {
        // localStorage.setItem("token", result.data);
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Your account is Created Successfully!",
        });
        setTimeout(function () {
          window.location = "/";
        }, 2000);
      })
      .catch((err) => {
        this.setState({ invalid: true });
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  render() {
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className={"SignUpauthbox"}>
          <div className={"SignUpleftBox"}>
            <div className={"SignUpbgGreen"} />
            <div className={"imageAuth"} />
            <div className={"imageText bold style1"}>My Asset</div>
            <div className={"imageText style2"}>Manage Your Assets Here</div>
          </div>
          <div className={"SignUprightBox"}>
            <div className={"box"}>
              <div className={"titleSignUp"}>Sign Up</div>
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your First Name"}
                  name="fname"
                  onChange={this.onChange}
                />
              </div>
              {this.state.error["fname"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["fname"]}
                </span>
              )}
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your Last Name"}
                  name="lname"
                  onChange={this.onChange}
                />
              </div>
              {this.state.error["lname"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["lname"]}
                </span>
              )}
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your Email"}
                  name="email"
                  onChange={this.onChange}
                />
              </div>
              {this.state.error["email"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["email"]}
                </span>
              )}
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"password"}
                  placeholder={"Enter your Password"}
                  name="password"
                  value={this.state.value}
                  onChange={this.onChange}
                />
              </div>
              {this.state.error["password"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["password"]}
                </span>
              )}
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your Department"}
                  name="department"
                  onChange={this.onChange}
                />
              </div>
              {this.state.error["department"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["department"]}
                </span>
              )}
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your Contact No"}
                  name="contact"
                  onChange={this.onChange}
                />
              </div>
              {this.state.error["contact"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["contact"]}
                </span>
              )}
              <div className={"btnAuth"}>
                <Button
                  label="Sign-Up"
                  className={"btnAuth"}
                  onClick={this.onSubmit}
                  type="submit"
                />
              </div>
              <div className={"SignUp"}>
                Have a Account
                <a href="/" className={"SignUp text"}>
                  Sign In?
                </a>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp;
