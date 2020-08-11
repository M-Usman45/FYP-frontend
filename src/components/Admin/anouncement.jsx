import React, { Component } from "react";
import Joi from "joi-browser";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Growl } from "primereact/growl";
import * as anounceService from "../../service/anounceService";
import * as userService from "../../service/userService";

export class Anouncement extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      error: {},
    };
    //  this.onTitleChange = this.onTitleChange.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  schema = {
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().max(200).label("Description"),
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
    const { data} = this.state;
    const errors = this.validate();
    this.setState({ error: errors || {} });
    if (errors) {
      alert(errors);
      return;
    }
    await anounceService
      .addAnouncement(data.title, data.description)
      .then((result) => {
        userService.addEvent(data.title, Date.now(), "", "").then((result) => {
          alert("Announcement posted successfully!!");
          //this.setState({ data });
          console.log(result.data);
        });
        alert(result.data);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Getting Announcements failed!",
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
            <h1>Anouncement</h1>
            <div className="p-grid">
              <div className="p-col-12 p-md-2">
                <label htmlFor="title">Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <InputText name="title" onChange={this.onChange} />
                {this.state.error["title"] && (
                  <span style={{ color: "red" }}>
                    {this.state.error["title"]}
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
              <div className="p-col-12 p-md-4">
                <Button
                  label="Post"
                  //icon="pi pi-pencil"
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

export default Anouncement;
