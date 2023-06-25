import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();

  // Fungsi untuk menentukan apakah suatu item menu harus diaktifkan berdasarkan URL saat ini
  const isMenuItemActive = (menuItemPath) => {
    return location.pathname === menuItemPath;
  };

  return (
    <div className="sidebar-wrapper sidebar-theme">
      <div id="dismiss" className="d-lg-none">
        <i className="flaticon-cancel-12"></i>
      </div>

      <nav id="sidebar">
        <ul className="navbar-nav theme-brand flex-row  d-none d-lg-flex">
          <li className="nav-item d-flex"></li>
          <li className="nav-item theme-text">
            <a href="index.html" className="nav-link">
              Admin
            </a>
          </li>
        </ul>

        <ul className="list-unstyled menu-categories" id="accordionExample">
          <li className="menu"></li>
          <li className="menu">
            <NavLink
              to="/ecommerce"
              data-toggle="collapse"
              aria-expanded="true"
              className="dropdown-toggle"
            >
              <div className="">
                <i className="flaticon-cart-2"></i>
                <span>TIRTA STORE</span>
              </div>
              <div>
                <i className="flaticon-right-arrow"></i>
              </div>
            </NavLink>
            <ul
              className="collapse submenu list-unstyled show"
              id="ecommerce"
              data-parent="#accordionExample"
            >
              <li className={isMenuItemActive("/") ? "active" : ""}>
                <NavLink to="/">Orders</NavLink>
              </li>

              <li className={isMenuItemActive("/payment") ? "active" : ""}>
                <NavLink to="/payment">View Payments</NavLink>
              </li>
              <li className={isMenuItemActive("/customer") ? "active" : ""}>
                <NavLink to="/customer">View Customers</NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
