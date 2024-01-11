import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Logo from "../Images/logo-t.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { Tooltip } from "reactstrap";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const [tooltipOpenHome, setTooltipOpenHome] = useState(false);
  const [tooltipOpenProfile, setTooltipOpenProfile] = useState(false);
  const [tooltipOpenLogOut, setTooltipOpenLogOut] = useState(false);

  const handlelogout = async () => {
    dispatch(logout());
    // Use async/await and setTimeout to add a small delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/");
  };
  return (
    <Navbar className="navigation" light expand="md">
      <Link to="/home" className="navs">
        <img src={Logo} className="logo" alt="Logo" />
      </Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          <NavItem>
            <Link to="/home" className="navs">
              <FaHome id="homeLink" />
            </Link>
            <Tooltip
              isOpen={tooltipOpenHome}
              placement="top"
              target="homeLink"
              toggle={() => {
                setTooltipOpenHome(!tooltipOpenHome);
              }}
            >
              Home
            </Tooltip>
          </NavItem>
          <NavItem>
            <Link to="/profile" className="navs">
              <FaUserAlt id="profileLink" />
            </Link>
            <Tooltip
              isOpen={tooltipOpenProfile}
              placement="top"
              target="profileLink"
              toggle={() => {
                setTooltipOpenProfile(!tooltipOpenProfile);
              }}
            >
              Profile
            </Tooltip>
          </NavItem>

          <NavItem>
            <Link onClick={handlelogout} className="navs">
              <FaSignOutAlt id="logOutLink" />
            </Link>
            <Tooltip
              isOpen={tooltipOpenLogOut}
              placement="top"
              target="logOutLink"
              toggle={() => {
                setTooltipOpenLogOut(!tooltipOpenLogOut);
              }}
            >
              Logout
            </Tooltip>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
