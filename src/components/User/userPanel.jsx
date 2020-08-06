import React, { Component } from "react";
import classNames from "classnames";
import { AppTopbar } from "../common/AppTopbar";
import { AppFooter } from "../common/AppFooter";
import { AppMenu } from "../common/AppMenu";
import { AppProfile } from "../common/AppProfile";
import { Route } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { SendComplain } from "./sendComplain";
import OrganizationAssets from "./organizationAssets";
import SendRequest from "./sendRequest";
import InUsedAssets from "./inUsedAssets";
import UserRequests from "./userRequests";
import ViewProfile from "../common/viewProfile";
import UserComplains from "./userComplains";
import EditRequest from "./editRequest";
import EditComplain from "./editComplain";
import CalenderProfile from "../common/calenderProfile";
import * as userService from "../../service/userService";
import * as authService from "../../service/authService";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "../../layout/layout.scss";

class UserPanel extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
  }

  componentDidMount() {
    this.getUser();
    console.log("userpanel Did Mount", this.state.user);
  }

  getUser() {
    const token = authService.getCurrentUser();
    console.log("Decoded id", token.id);
    userService
      .getUserInfo(token.id)
      .then((result) => {
        this.setState({ user: result.data });
        console.log(result.data);
      })
      .catch((err) => {
        console.log("error");
      });
  }

  onWrapperClick(event) {
    if (!this.menuClick) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false,
      });
    }

    this.menuClick = false;
  }

  onToggleMenu(event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.state.layoutMode === "overlay") {
        this.setState({
          overlayMenuActive: !this.state.overlayMenuActive,
        });
      } else if (this.state.layoutMode === "static") {
        this.setState({
          staticMenuInactive: !this.state.staticMenuInactive,
        });
      }
    } else {
      const mobileMenuActive = this.state.mobileMenuActive;
      this.setState({
        mobileMenuActive: !mobileMenuActive,
      });
    }

    event.preventDefault();
  }

  onSidebarClick(event) {
    this.menuClick = true;
  }

  onMenuItemClick(event) {
    if (!event.item.items) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false,
      });
    }
  }

  createMenu() {
    this.menu = [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        command() {
          window.location = "#/";
        },
      },
      {
        label: "Assets",
        icon: "pi pi-fw pi-globe",
        items: [
          {
            label: "Organization`s Asset ",
            icon: "pi pi-fw pi-globe",
            command: () => {
              window.location = "#/organizationAssets";
            },
          },
          {
            label: "In used Assets",
            icon: "pi pi-fw pi-globe",
            command: () => {
              window.location = "#/inUsedAssets";
            },
          },
        ],
      },
      {
        label: "Complains",
        icon: "pi pi-fw pi-th-large",
        items: [
          {
            label: "Send Complain",
            icon: "pi pi-fw pi-th-large",
            command: () => {
              window.location = "#/sendComplain";
            },
          },
          {
            label: "View Complains",
            icon: "pi pi-fw pi-th-large",
            command: () => {
              window.location = "#/userComplains";
            },
          },
        ],
      },
      {
        label: "Requests",
        icon: "pi pi-fw pi-th-large",
        items: [
          {
            label: "Send Asset Request",
            icon: "pi pi-fw pi-th-large",
            command: () => {
              window.location = "#/sendRequest";
            },
          },
          {
            label: "View Requests",
            icon: "pi pi-fw pi-th-large",
            command: () => {
              window.location = "#/userRequests";
            },
          },
        ],
      },
    ];
  }

  addClass(element, className) {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  }

  removeClass(element, className) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  componentDidUpdate() {
    if (this.state.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  }

  render() {
    const { user } = this.state;
    let username = user.firstname + " " + user.lastname;
    // const logo =
    //   this.state.layoutColorMode === "dark"
    //     ? "assets/layout/images/logo-white.svg"
    //     : "assets/layout/images/logo.svg";

    const wrapperClass = classNames("layout-wrapper", {
      "layout-overlay": this.state.layoutMode === "overlay",
      "layout-static": this.state.layoutMode === "static",
      "layout-static-sidebar-inactive":
        this.state.staticMenuInactive && this.state.layoutMode === "static",
      "layout-overlay-sidebar-active":
        this.state.overlayMenuActive && this.state.layoutMode === "overlay",
      "layout-mobile-sidebar-active": this.state.mobileMenuActive,
    });

    const sidebarClassName = classNames("layout-sidebar", {
      "layout-sidebar-dark": this.state.layoutColorMode === "dark",
      "layout-sidebar-light": this.state.layoutColorMode === "light",
    });

    return (
      <div className={wrapperClass} onClick={this.onWrapperClick}>
        <AppTopbar onToggleMenu={this.onToggleMenu} />

        <div
          ref={(el) => (this.sidebar = el)}
          className={sidebarClassName}
          onClick={this.onSidebarClick}
        >
          {/* <div className="layout-logo">
            <h1 style={{ color: "white" }}> My Asset Logo</h1>
          </div> */}
          <AppProfile username={username} />
          <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
        </div>

        <div className="layout-main">
          <Route path="/" exact component={Dashboard} />
          <Route path="/organizationAssets" component={OrganizationAssets} />
          <Route path="/sendComplain" component={SendComplain} />
          <Route path="/sendRequest" component={SendRequest} />
          <Route path="/inUsedAssets" component={InUsedAssets} />
          <Route path="/userComplains" component={UserComplains} />
          <Route path="/userRequests" component={UserRequests} />
          <Route path="/viewProfileOfUser" component={ViewProfile} />
          <Route path="/calender" component={CalenderProfile} />
          <Route
            path="/editRequest"
            render={(props) => <EditRequest {...props} />}
          />
          <Route
            path="/editComplain"
            render={(props) => <EditComplain {...props} />}
          />
        </div>

        <AppFooter />

        <div className="layout-mask"></div>
      </div>
    );
  }
}

export default UserPanel;
