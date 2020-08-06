import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AdminPanel from "./components/Admin/adminPanel";
import UserPanel from "./components/User/userPanel";
import SignUp from "./components/common/signUp";
import Login from "./components/common/login";
import authService from "./service/authService";
import ForgotPassword from "./components/common/forgotPassword";
class App extends Component {
  renderComp() {}

  render() {
    const isLoginn = authService.getCurrentUser() ? true : false;
    const Admin = authService.isAdmin();
    if (Admin) {
      return <AdminPanel />;
    }
    if (isLoginn) return <UserPanel />;

    return (
      <React.Fragment>
        <main className="Container">
          <React.Fragment>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/signUp" component={SignUp} />
              <Route path="/forgotPassword" component={ForgotPassword} />
              <Route path="/adminPanel" component={AdminPanel} />
              <Route path="/userPanel" component={UserPanel} />
            </Switch>
          </React.Fragment>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
