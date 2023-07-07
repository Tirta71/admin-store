import React from "react";
import SimpleTable from "../components/Table/SimpleTable";
import SideBar from "../components/orders/SideBar";
import NavDesktop from "../components/orders/NavDesktop";
import NavMobile from "../components/orders/NavMobile";
import PageHeaders from "../components/orders/PageHeaders";

export default function NoLogin() {
  const customer = {
    title: "Guest",
    store: "TIRTA STORE",
  };
  return (
    <div>
      <NavMobile />

      <NavDesktop />
      <div className="main-container" id="container">
        <div className="overlay"></div>
        <div className="cs-overlay"></div>
        <SideBar />
        <div id="content" className="main-content">
          <div className="container">
            <PageHeaders item={customer} />
            <div className="row">
              <SimpleTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
