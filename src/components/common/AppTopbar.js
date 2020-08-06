import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
export class AppTopbar extends Component {
  static defaultProps = {
    onToggleMenu: null,
  };

  static propTypes = {
    onToggleMenu: PropTypes.func.isRequired,
  };

  logout = () => {
    console.log("Logging out ..............................................");
    localStorage.removeItem("token");
    window.location = "/";
  };

  render() {
    return (
      <div className="layout-topbar clearfix" style={{ background: "#1c8ef9" }}>
        <button
          className="p-link layout-menu-button"
          onClick={this.props.onToggleMenu}
        >
          <span className="pi pi-bars" />
        </button>
        <div className="layout-topbar-icons">
          <Link to="/calender">
            <button className="p-link">
              <span className="layout-topbar-item-text">Events</span>
              <span className="layout-topbar-icon pi pi-calendar" />
              {/* <span className="layout-topbar-badge">5</span> */}
            </button>
          </Link>
          <Link to="/viewProfileOfUser">
            <button className="p-link">
              <span className="layout-topbar-item-text">User</span>
              <span
                className="layout-topbar-icon pi pi-user"
                //tooltip="Account Info"
                //tooltipOptions={{ position: "right" }}
              />
            </button>
          </Link>
          <button className="p-link" onClick={this.logout}>
            <span className="layout-topbar-item-text">Log Out</span>
            <span className="layout-topbar-icon pi pi-power-off" />
          </button>
        </div>
      </div>
    );
  }
}
