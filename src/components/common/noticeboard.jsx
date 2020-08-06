import React, { Component } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import * as anounceService from "../../service/anounceService";
import { DataView } from "primereact/dataview";

class Noticeboard extends Component {
  constructor() {
    super();
    this.state = {
      anouncements: "",
    };
    this.getAnouncememnts = this.getAnouncememnts.bind(this);
    this.itemTemplate = this.itemTemplate.bind(this);
  }

  componentDidMount() {
    this.getAnouncememnts();
  }

  getAnouncememnts() {
    anounceService
      .viewAnouncements()
      .then((result) => {
        this.setState({ anouncements: result.data });
       })
      .catch((err) => {
        console.log(err);
      });
  }

  itemTemplate(anouncement) {
    return (
      <div>
        <div
          className="p-grid"
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          <h1> {anouncement.title} </h1>
        </div>
        <div
          style={{
            borderBottom: "2px solid",
            width: "100px",
            marginBottom: "20px",
            marginLeft: "10px",
          }}
        />
        <div className="p-grid" style={{ marginLeft: "10px" }}>
          {anouncement.description}
        </div>
      </div>
    );
  }

  render() {
    const { anouncements } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        {!anouncements && (
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="8"
            fill="#EEEEEE"
            animationDuration=".5s"
          />
        )}

        {anouncements && (
          <React.Fragment>
            <div style={{ height: "250px", overflow: "scroll" }}>
              <DataView
                value={this.state.anouncements}
                layout="list"
                itemTemplate={this.itemTemplate}
              ></DataView>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Noticeboard;
