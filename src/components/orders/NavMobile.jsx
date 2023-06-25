import React from "react";

export default function NavMobile() {
  return (
    <header className="tabMobileView header navbar fixed-top d-lg-none">
      <div className="nav-toggle">
        <a
          href="javascript:void(0);"
          className="nav-link sidebarCollapse"
          data-placement="bottom"
        >
          <i className="flaticon-menu-line-2"></i>
        </a>
      </div>
      <ul className="nav navbar-nav">
        <li className="nav-item d-lg-none">
          <form className="form-inline justify-content-end" role="search">
            <input
              type="text"
              className="form-control search-form-control mr-3"
            />
          </form>
        </li>
      </ul>
    </header>
  );
}
