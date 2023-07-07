import React from "react";

export default function SideBar() {
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
            <a
              href="#ecommerce"
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
            </a>
            <ul
              className="collapse submenu list-unstyled show"
              id="ecommerce"
              data-parent="#accordionExample"
            >
              <li className="">
                <a href="/"> Orders </a>
              </li>

              <li>
                <a href="/payment"> View Payments </a>
              </li>
              <li>
                <a href="/customer"> View Customers </a>
              </li>
              <li>
                <a href="/no-login"> Guest </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
