import React, { useState, useEffect } from 'react';
import {Route, Switch } from "react-router-dom";
import { Routes } from "../routes";

import Signin from "./Signin";
import Signup from "./Signup";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Welcome from './Welcome';
import BoardAdmin from './Admin/BoardAdmin';
import BoardUser from './User/BoardUser';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardOverview from './dashboard/DashboardOverview';
import ImageUpload from "./User/ImageUpload";
import VideoUpload from "./User/VideoUpload";
import Edit from "./Admin/Edit";
import Create from "./Admin/Create";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loading, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Route {...rest} render={props => ( <>  <Component {...props} /> </> ) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loading, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Route {...rest} render={props => (
      <>
        <Sidebar />
        <main className="content">
          <Navbar />
          <Component {...props} />
        </main>
      </>
    )}
    />
  )}

export default () => (
  <Switch>
    <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithSidebar exact path={Routes.Profile.path} component={Profile} />
    <RouteWithSidebar exact path={Routes.ImageUpload.path} component={ImageUpload} />
    <RouteWithSidebar exact path={Routes.VideoUpload.path} component={VideoUpload} />
    <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    <RouteWithLoader exact path={Routes.Welcome.path} component={Welcome} />
    <RouteWithSidebar exact path={Routes.BoardAdmin.path} component={BoardAdmin} />
    <RouteWithSidebar exact path={Routes.BoardUser.path} component={BoardUser} />
    <RouteWithSidebar exact path={Routes.Edit.path} component={Edit} />
    <RouteWithSidebar exact path={Routes.Create.path} component={Create} />
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
  </Switch>
);