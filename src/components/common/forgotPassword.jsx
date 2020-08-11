import React, { Component } from "react";
import Joi from "joi-browser";
import { Growl } from "primereact/growl";
import { Button } from "primereact/button";
import * as userService from "../../service/userService";
import "../../login.css";
class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      errorMsg: "",
      email: "",
      error: "",
      code: "",
      password1: "",
      similiar: true,
      password2: "",
      codeSent: false,
      newPass: false,
    };
    this.resetPassword = this.resetPassword.bind(this);
    this.validateCode = this.validateCode.bind(this);
    this.resetPasswordFinal = this.resetPasswordFinal.bind(this);
  }

  schema = {
    email: Joi.string().required().email({ minDomainAtoms: 2 }).label("email"),
    password1: Joi.string().required().min(8).label("New Password"),
    password2: Joi.string().required().min(8).label("Confirm Password"),
    code: Joi.number().required().min(4).label("Verification Code"),
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

  resetPasswordFinal() {
    // const errors = this.validate();
    // this.setState({ error: errors });
    // if (errors) {
    //   alert(errors);
    //   return;
    // }
    userService
      .resetPassFinal(this.state.email, this.state.password1)
      .then((result) => {
        console.log(result.data);
        //localStorage.setItem("token", result.data);
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Password Changed Successfully!",
        });
        setTimeout(function () {
          window.location = "/";
        }, 2000);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Server error!",
        });
      });
  }
  validateCode() {
    // const errors = this.validate();
    // this.setState({ error: errors });
    // if (errors) {
    //   alert(errors);
    //   return;
    // }
    userService
      .validateCodeViaEmail(this.state.email, this.state.code)
      .then((result) => {
        this.setState({ newPass: true });
      })
      .catch((err) => {
        this.setState({ error: true });
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Invalid Code",
          detail: "Please enter the correct code recieved via email",
        });
      });
  }
  resetPassword() {
    // const errors = this.validate();
    // this.setState({ error: errors });
    // if (errors) {
    //   alert(errors);
    //   return;
    // }
    userService
      .resetPassword(this.state.email)
      .then((result) => {
        this.setState({ codeSent: true });
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true });
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Invalid Email",
          detail: "Please try again with a registered email",
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
              <div className={"titleAuth"}>Forgot Password</div>
              <div className={"inputSBox"}>
                <input
                  className={"inputS"}
                  type={"text"}
                  placeholder={"Enter your email"}
                  disabled={this.state.codeSent}
                  name="email"
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                    this.onChange(e);
                  }}
                />
              </div>
              {this.state.error["email"] && (
                <span style={{ color: "red" }}>
                  {this.state.error["email"]}
                </span>
              )}
              {this.state.error && <h4>{this.state.errorMsg}</h4>}
              {!this.state.codeSent && (
                <div className={"btnAuth"}>
                  <Button
                    label="Send Code"
                    className={"btnAuth"}
                    onClick={this.resetPassword}
                    disabled={!this.state.email}
                    type="submit"
                  />
                </div>
              )}
              {this.state.codeSent && (
                <React.Fragment>
                  <div className={"inputSBox"}>
                    <input
                      style={{ width: "300px" }}
                      className={"inputS"}
                      disabled={this.state.newPass}
                      name="code"
                      placeholder="Enter the code Recieved Via Email"
                      onChange={(e) => {
                        this.setState({ code: e.target.value });
                        this.onChange(e);
                      }}
                    />
                  </div>

                  {!this.state.newPass && (
                    <div className={"btnAuth"}>
                      <Button
                        label="Verify"
                        className={"btnAuth"}
                        onClick={this.validateCode}
                      />
                    </div>
                  )}
                  {this.state.newPass && (
                    <React.Fragment>
                      {!this.state.similiar && (
                        <h4>Please enter same password</h4>
                      )}
                      <div className={"inputSBox"}>
                        <input
                          className={"inputS"}
                          //disabled={this.state.newPass}
                          // value={this.state.email}
                          type={"password"}
                          placeholder="Enter Password"
                          onChange={(e) =>
                            this.setState({ password1: e.target.value })
                          }
                        />
                      </div>

                      <div className={"inputSBox"}>
                        <input
                          className={"inputS"}
                          type={"password"}
                          //disabled={this.state.newPass}
                          placeholder="Re enter password"
                          value={this.state.password2}
                          onChange={(e) => {
                            this.setState({ password2: e.target.value });
                            if (this.state.password1 !== this.state.password2) {
                              this.setState({ similiar: false });
                            } else {
                              this.setState({ similiar: true });
                            }
                          }}
                        />
                      </div>
                      <Button
                        label="Save"
                        className={"btnAuth"}
                        onClick={this.resetPasswordFinal}
                      />
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              <Button
                //label="Back"
                icon="pi pi-arrow-left"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  window.location = "/";
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ForgotPassword;
