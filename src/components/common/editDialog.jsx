import React, { Component } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

class EditDialog extends Component {
  state = {};

  renderProfileForm = () => {
    console.log("Render Profile Form");
    return (
      <React.Fragment>
        <div className="p-grid">
          <InputText
            id="firstname"
            name="firstname"
            placeholder="Enter your First Name"
            onChange={this.onChange}
          />
        </div>
        <div className="p-grid">
          <InputText
            id="lastname"
            name="lastname"
            placeholder="Enter your Last Name"
            onChange={this.onChange}
          />
        </div>
        <div className="p-grid">
          <InputText
            id="email"
            name="email"
            placeholder="Enter your Email"
            onChange={this.onChange}
          />
        </div>
        <div className="p-grid">
          <InputText
            id="department"
            name="department"
            placeholder="Enter your Department"
            onChange={this.onChange}
          />
        </div>
        <div className="p-grid">
          <InputText
            id="contact"
            name="contact"
            placeholder="Enter your Contact No"
            onChange={this.onChange}
          />
        </div>
        <div className="p-grid">
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={this.profileDialog}
          />
        </div>
      </React.Fragment>
    );
  };

  render() {
    return (
      <Dialog
        header={"Edit Profile"}
        visible={this.props.visibility}
        style={{ width: "50vw" }}
        footer={
          <Button
            label="Edit"
            icon="pi pi-pencil"
            onClick={this.profileDialog}
          />
        }
        dismissableMask={true}
        blockScroll={false}
        itemTemplate={this.renderProfileForm}
        onHide={this.ProfileHide}
        maximizable={true}
      >
        {this.renderProfileForm}
      </Dialog>
    );
  }
}

export default EditDialog;
