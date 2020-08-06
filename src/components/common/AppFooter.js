import React, { Component } from "react";

export class AppFooter extends Component {
  render() {
    return (
      <div className="layout-footer">
        <span className="footer-text" style={{ marginRight: "5px" }}>
          My Asset
        </span>
        <span className="footer-text" style={{ marginLeft: "5px" }}>
          <img src="logos/logo.jpeg" alt="" width="20" />
        </span>
      </div>
    );
  }
}
