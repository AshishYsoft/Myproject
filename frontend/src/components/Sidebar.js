import React, { useState, useEffect } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHandHoldingUsd, faAddressCard,  faPhotoVideo, faVideo, faPortrait, faUserEdit, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import AuthService from "../services/auth.service";

import { Routes } from "../routes";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";

export default () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logout = () => {
    AuthService.logout();
  }

  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.DashboardOverview.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
              </div>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">             
              <CollapsableNavItem eventKey="tables/" title="Profile Details" icon={faPortrait}>
                <NavItem title="My Profile" link={Routes.Profile.path} icon={faAddressCard} />
                  </CollapsableNavItem>
                   </Nav>
                <div className="navbar-nav mr-auto">
                  {showAdminBoard && (
                    <li className="nav-item">
                      <NavItem title="Admin Dashboard" link={Routes.BoardAdmin.path} icon={faHandHoldingUsd} />
                    </li>
                  )}
                  {showAdminBoard && (
                    <li className="nav-item">
                      <NavItem title="Add User" link={Routes.Create.path} icon={faUserEdit} />
                    </li>
                  )}

                  {currentUser && (
                    <li className="nav-item">
                      <NavItem title="User Dashboard" link={Routes.BoardUser.path} icon={faUser} />
                    </li>
                  )}
              </div>
                <NavItem title="Photo Management" link={Routes.ImageUpload.path} icon={faPhotoVideo} />
                <NavItem title="Video Management" link={Routes.VideoUpload.path} icon={faVideo} />
                  
                {currentUser ? (
                  <div className="navbar-nav ml-auto">
                    <li className="nav-item"  icon={faSignOutAlt}>
                      <a href="/" className="nav-link" onClick={logout}>
                        Logout
                      </a>
                    </li>
                  </div>
                ) : (
                  <div className="navbar-nav ml-auto"></div>
                )}
              <Dropdown.Divider className="my-3 border-indigo" />
           
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};