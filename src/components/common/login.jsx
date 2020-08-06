import React, { Component } from "react";
import { Button } from "primereact/button";
import Joi from "joi-browser";
import * as authService from "../../service/authService";
import { Growl } from "primereact/growl";
import "../../login.css";
class Login extends Component {
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
    email: Joi.string().required().email({ minDomainAtoms: 2 }).label("Email"),
    password: Joi.string().required().min(8).label("Password"),
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
    e.preventDefault();
    const { data } = this.state;
    const errors = this.validate();
    this.setState({ error: errors || {} });
    // console.log(error);
    if (errors) {
      this.growl.show({
        life: "3000",
        severity: "error",
        summary: "Validation Error!",
      });
      return;
    }
    authService
      .UserLogin(data.email, data.password)
      .then((result) => {
        localStorage.setItem("token", result.data);
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Login Successfully!",
        });
        setTimeout(function () {
          window.location = "/";
        }, 2000);
      })
      .catch((err) => {
        this.setState({ invalid: true });
        console.log(err)
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Invalid Email Password!",
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className={"authbox"}>
          <div className={"leftBox"}>
            <div className={"bgGreen"} />
            <div className={"imageAuth"} />
            <div className={"imageText bold style1"}>My Asset</div>
            <div className={"imageText style2"}>Manage Your Assets Here</div>
          </div>
          <div className={"rightBox"}>
            <div className={"box"}>
              <div className={"titleAuth"}>Sign In</div>
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your email"}
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
                  placeholder={"Password"}
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
              <div className={"contentBox"}>
                {/* <input type={"checkbox"} className={"checkbox"} />
                <label className={"checkboxLabel"}> Remember</label> */}
                <a href="#/forgotPassword" className={"text1"}>
                  Forgot password?
                </a>
              </div>
              <div className={"btnAuth"}>
                <Button
                  label="Sign-In"
                  className={"btnAuth"}
                  onClick={this.onSubmit}
                  type="submit"
                />
              </div>
              <div className={"borderBox"}>
                <div className={"line"}>
                  <div className={"text2 or"}> or </div>
                </div>
              </div>
              <div className={"SignIn"}>
                No Account
                <a href="#/signUp" className={"SignIn text"}>
                  Sign Up?
                </a>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
