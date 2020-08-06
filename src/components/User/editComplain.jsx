import React, { Component } from "react";
import Joi from "joi-browser";
import { Growl } from "primereact/growl";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import "react-toastify/dist/ReactToastify.css";
import * as compService from "../../service/compService";

export class EditComplain extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      error: "",
      complain: "",
      spinnerValue: null,
    };
    //  this.onTitleChange = this.onTitleChange.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  schema = {
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("Description"),
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

  async onEdit() {
    const { data} = this.state;
    delete data["_id"];
    const errors = this.validate();
    console.log(errors);
    this.setState({ error: errors || {} });
    if (errors) {
      this.growl.show({
        life: "3000",
        severity: "error",
        summary: "Validation Error!",
      });
      return;
    }
    const _id = this.props.location.state.id;
    await compService
      .editComplain(_id, data.title, data.description)
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Complain Edited Successfully!",
        });
        setTimeout(function () {
          window.location = "#/userComplains";
        }, 2000);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Editing Complain failed",
          detail: "Server error!",
        });
      });
  }
  componentDidMount() {
    const _id = this.props.location.state.id;
    //console.log("In Edit Complain cdd props id", _id)
    compService
      .getInfo(_id)
      .then((result) => {
        this.setState({ data: result.data });
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Accessing Compalins Details failed ",
          detail: "Server error!",
        });
      });
  }
  render() {
    return (
      <React.Fragment>
        <Growl ref={(el) => (this.growl = el)} />
        <div className="p-fluid">
          <div className="p-grid">
            <div className="p-col-12">
              <div className="card card-w-title">
                <h1>Edit Complain</h1>
                <div className="p-grid">
                  <div className="p-col-12 p-md-2">
                    <label htmlFor="title">Complain Title</label>
                  </div>
                </div>
                <div className="p-grid">
                  <div className="p-col-12 p-md-4">
                    <InputText
                      id="title"
                      name="title"
                      value={this.state.data.title}
                      onChange={this.onChange}
                    />
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
                      value={this.state.data.description}
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
                      label="Edit"
                      // icon="pi pi-pencil"
                      onClick={this.onEdit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditComplain;
