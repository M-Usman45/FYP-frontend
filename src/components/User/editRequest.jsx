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

export class EditRequest extends Component {
  constructor() {
    super();
    this.state = {
      data: { title: "" },
      assets: [{ id: "", title: "" }],
      asset: { title: "" },
      error: "",
      issueDate: null,
      returnDate: null,
    };
    //  this.onTitleChange = this.onTitleChange.bind(this)
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    //this.getData = this.getData.bind(this);
  }

  getData() {
    const _id = this.props.location.state.id;
    reqService
      .getInfo(_id)
      .then((result) => {
        this.setState({ data: result.data });
        this.setState({ issueDate: result.data.issueDate });
        this.setState({ issueDate: result.data.issueDate });
        this.setState({ asset: result.data.assetTitle });
        console.log(this.state.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
  async onEdit() {
    const { data } = this.state;
    const _id = this.props.location.state.id;

    await reqService
      .editRequest(
        _id,
        data.title,
        this.state.asset.title,
        this.state.issueDate,
        this.state.returnDate,
        data.description
      )
      .then((result) => {
        this.growl.show({
          life: "2000",
          severity: "success",
          summary: "Request edited Successfully!",
        });
        setTimeout(function () {
          window.location = "#/userRequests";
        }, 2000);
      })
      .catch((err) => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Editing Request failed!",
          detail: "Server Error!",
        });
      });
  }

  componentDidMount() {
    assetService
      .getAssetTitles()
      .then((result) => {
        this.setState({ assets: result.data });
        console.log(result.data);
      })
      .catch((error) => {
        alert(error);
      });
    this.getData();
  }
  render() {
    const { data } = this.state;
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
                <InputText
                  id="title"
                  name="title"
                  value={data.title}
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
                <label htmlFor="assetTitle">Asset Title</label>
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Dropdown // yh value set ni h
                  optionLabel="title"
                  value={this.state.asset}
                  placeholder="Select an Asset"
                  options={this.state.assets}
                  // name="title"
                  //optionLabel="title"
                  onChange={(e) => {
                    this.setState({ asset: e.value });
                  }}
                />
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
                  value={data.description}
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
                  //  dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={data.issueDate}
                  onChange={(event) => {
                    this.setState({ issueDate: event.value });
                    console.log(this.state.issueDate);
                  }}
                />
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
                  //dateFormat="dd/mm/yy"
                  showIcon={true}
                  value={data.returnDate}
                  onChange={(event) => {
                    this.setState({ returnDate: event.value });
                    console.log(this.state.returnDate);
                  }}
                />
              </div>
            </div>
            <div className="p-grid">
              <div className="p-col-12 p-md-4">
                <Button label="Edit" onClick={this.onEdit} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditRequest;
