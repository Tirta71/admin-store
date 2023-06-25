import React from "react";
import NavMobile from "../components/orders/NavMobile";
import NavDesktop from "../components/orders/NavDesktop";
import SideBar from "../components/orders/SideBar";
import PageHeaders from "../components/orders/PageHeaders";
import TableCustomer from "../components/customers/tableCustomer";

export default function Customer() {
  const customer = {
    title: "customer",
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

            <TableCustomer />
          </div>
        </div>
      </div>
    </div>
  );
}
