import React from "react";

export default function NavDesktop() {
  return (
    <header className="header navbar fixed-top navbar-expand-sm">
      <a
        href="javascript:void(0);"
        className="sidebarCollapse d-none d-lg-block"
        data-placement="bottom"
      >
        <i className="flaticon-menu-line-2"></i>
      </a>

      <ul className="navbar-nav flex-row ml-lg-auto">
        <li className="nav-item  d-lg-block d-none">
          <form className="form-inline" role="search">
            <input
              type="text"
              className="form-control search-form-control"
              placeholder="Search..."
            />
          </form>
        </li>
      </ul>
    </header>
  );
}
