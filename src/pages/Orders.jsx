import React from "react";
import NavMobile from "../components/orders/NavMobile";
import NavDesktop from "../components/orders/NavDesktop";
import SideBar from "../components/orders/SideBar";
import PageHeaders from "../components/orders/PageHeaders";
import OrderStatus from "../components/orders/Order status/OrderStatus";
import OrderListing from "../components/orders/Order status/OrderListing";

export default function Orders() {
  const order = {
    title: "order item",
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
            <PageHeaders item={order} />

            <div className="row">
              <OrderStatus />
              <OrderListing />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
