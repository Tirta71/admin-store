import React from "react";
import NavMobile from "../components/orders/NavMobile";
import NavDesktop from "../components/orders/NavDesktop";
import SideBar from "../components/orders/SideBar";
import PageHeaders from "../components/orders/PageHeaders";
import CardPayment from "../components/payment/CardPayment";
import TablePayment from "../components/payment/TablePayment";

export default function WalletTopUp() {
  const wallet = {
    title: "Wallet Top up",
    store: "TIRTA STORE",
  };
  return (
    <div>
      {/* <!-- Tab Mobile View Header --> */}
      <NavMobile />
      {/* <!-- Tab Mobile View Header -->

    <!--  BEGIN NAVBAR  --> */}
      <NavDesktop />
      {/* <!--  END NAVBAR  -->

    <!--  BEGIN MAIN CONTAINER  --> */}
      <div className="main-container" id="container">
        <div className="overlay"></div>
        <div className="cs-overlay"></div>
        {/* 
        <!--  BEGIN SIDEBAR  --> */}

        <SideBar />
        {/* 
        <!--  END SIDEBAR  -->

        <!--  BEGIN CONTENT PART  --> */}
        <div id="content" className="main-content">
          <div className="container">
            <PageHeaders item={wallet} />

            <div className="row" id="cancel-row">
              <CardPayment />
              <TablePayment />
            </div>
          </div>
        </div>
        {/* <!--  END CONTENT PART  --> */}
      </div>
      {/* <!-- END MAIN CONTAINER --> */}
    </div>
  );
}
