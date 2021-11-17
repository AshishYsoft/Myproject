import React from "react";
import AuthService from "../services/auth.service";

const Profile = (props) => {
  const currentUser = AuthService.getCurrentUser();

  if (props.match.path === "/confirm/:confirmationCode") {
    AuthService.verifyUser(props.match.params.confirmationCode)
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <b>Token:</b> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <b>Id:</b> {currentUser.id}
      </p>
      <p>
        <b>Email:</b> {currentUser.email}
      </p>
      <p>
        <b>Status:</b> {currentUser.status}
      </p>
      <b>Authorities:</b>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;
