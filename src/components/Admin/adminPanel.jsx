import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import classNames from "classnames";
import { AppTopbar } from "../common/AppTopbar";
import { AppFooter } from "../common/AppFooter";
import { AppMenu } from "../common/AppMenu";
import { AppProfile } from "../common/AppProfile";
import { Dashboard } from "./Dashboard";
import AddAsset from "./addAsset";
import ViewAssets from "./viewAssets";
import viewRequests from "./viewRequests";
import viewComplains from "./viewComplains";
import viewUsers from "./viewUsers";
import viewAdmins from "./viewAdmins";
import RequestStatus from "./requestStatus";
import ComplainStatus from "./complainStatus";
import ApproveUser from "./approveUser";
import UsersRequest from "./usersRequest";
import AddAdmin from "./addAdmin";
import ViewCheckOut from "./viewCheckOut";
import ViewCheckIn from "./viewCheckIn";
import Anouncement from "./anouncement";
import Reports from "./reports";
import ViewAnouncements from "./viewAnouncements";
import ViewProfile from "../common/viewProfile";
import EditAsset from "./editAsset"
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "../../layout/layout.scss";
import authService from "../../service/authService";
import * as userService from "../../service/userService";
import CalenderProfile from "../common/calenderProfile";
import PageNotFound from "../common/pageNotFound";

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      admin: "",
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
    };

    this.getUser = this.getUser.bind(this);
    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
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

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    const token = authService.getCurrentUser();
    userService
      .getUserInfo(token.id)
      .then((result) => {
        this.setState({ admin: result.data });
      })
      .catch((err) => {
        console.log("error");
      });
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
        command: () => {
          window.location = "#/";
        },
      },
      {
        label: "Requests ",
        icon: "pi pi-fw pi-th-large",
        command: () => {
          window.location = "#/viewRequests";
        },
      },
      {
        label: "Complains",
        icon: "pi pi-fw pi-th-large",
        command: () => {
          window.location = "#/viewComplains";
        },
      },
      {
        label: "Users",
        icon: "pi pi-users",
        items: [
          {
            label: "Organization`s Users",
            icon: "pi pi-users",
            command: () => {
              window.location = "#/viewUsers";
            },
          },
          {
            label: "User Requests",
            icon: "pi pi-users",
            command: () => {
              window.location = "#/usersRequest";
            },
          },
        ],
      },
      {
        label: "Assets",
        icon: "pi pi-fw pi-globe",
        items: [
          {
            label: "Organization`s Assets",
            icon: "pi pi-fw pi-th-large",
            command: () => {
              window.location = "#/viewAssets";
            },
          },
          {
            label: "Add New Asset",
            icon: "pi pi-fw pi-file",
            command: () => {
              window.location = "#/addAsset";
            },
          },
        ],
      },

      {
        label: "Admins",
        icon: "pi pi-users",
        items: [
          {
            label: "View Admins",
            icon: "pi pi-users",
            command: () => {
              window.location = "#/viewAdmins";
            },
          },
          {
            label: "Add New Admin",
            icon: "pi pi-user-plus",
            command: () => {
              window.location = "#/registerAdmin";
            },
          },
        ],
      },
      {
        label: "Anouncement",
        icon: "pi pi-bell",
        items: [
          {
            label: "Add Anouncement",
            icon: "pi pi-fw pi-th-large",
            command: () => {
              window.location = "#/Addanouncement";
            },
          },
          {
            label: "View Announcements",
            icon: "pi pi-fw pi-file",
            command: () => {
              window.location = "#/viewAnounements";
            },
          },
        ],
      },
      {
        label: "Reports",
        icon: "pi pi-chart-bar",
        to: "/viewReports",
      },
      {
        label: "Check In",
        icon: "pi pi-fw pi-table",
        command: () => {
          window.location = "#/viewCheckIns";
        },
      },
      {
        label: "Check out",
        icon: "pi pi-fw pi-table",
        command: () => {
          window.location = "#/viewCheckOuts";
        },
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
    const { admin } = this.state;
    let username = admin.firstname + " " + admin.lastname;
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
          <AppProfile username={username} />
          <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
        </div>

        <div className="layout-main">
          <Switch>
            <Route
              path="/requestStatus"
              render={(props) => <RequestStatus {...props} />}
            />
            <Route
              path="/complainStatus"
              render={(props) => <ComplainStatus {...props} />}
            />
            <Route
              path="/approveUser"
              render={(props) => <ApproveUser {...props} />}
            />
            <Route 
               path="/editAsset"  
               render={ (props) => <EditAsset {...props} /> } 
            />
            <Route path="/addAsset" component={AddAsset} />
            <Route path="/viewAssets" component={ViewAssets} />
            <Route path="/viewRequests" component={viewRequests} />
            <Route path="/viewComplains" component={viewComplains} />
            <Route path="/viewUsers" component={viewUsers} />
            <Route path="/viewAdmins" component={viewAdmins} />
            <Route path="/usersRequest" component={UsersRequest} />
            <Route path="/viewProfileOfUser" component={ViewProfile} />
            <Route path="/calender" component={CalenderProfile} />
            <Route path="/registerAdmin" component={AddAdmin} />
            <Route path="/viewCheckIns" component={ViewCheckIn} />
            <Route path="/viewCheckOuts" component={ViewCheckOut} />
            <Route path="/Addanouncement" component={Anouncement} />
            <Route path="/viewAnounements" component={ViewAnouncements} />
            <Route path="/viewReports" component={Reports} />
            <Route path="/" exact component={Dashboard} />
            <Route path="/pageNotFound" component={PageNotFound}/>
            <Redirect to="/pageNotFound" />
          </Switch>
        </div>

        <AppFooter />

        <div className="layout-mask"></div>
      </div>
    );
  }
}

export default AdminPanel;
