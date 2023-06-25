import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderStatus() {
  const [orderStatus, setOrderStatus] = useState([]);

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(
        "https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user"
      );
      const usersData = response.data;

      const ordersPromises = usersData.map(async (user) => {
        const userResponse = await axios.get(
          `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user/${user.id}/history`
        );
        const orderData = userResponse.data;
        return orderData;
      });

      const ordersData = await Promise.all(ordersPromises);
      const allOrders = ordersData.flat();

      const successOrders = allOrders.filter((order) => order.status === true);
      const pendingOrders = allOrders.filter((order) => order.status === false);

      const totalTopup = successOrders.reduce(
        (total, order) => total + order.price,
        0
      );

      const orderStatusData = [
        {
          id: 1,
          status: "Total Order",
          progress: allOrders.length,
          today: "Total Order",
        },
        {
          id: 2,
          status: "Pending",
          progress: pendingOrders.length,
          today: "In Process",
        },
        {
          id: 3,
          status: "Success",
          progress: successOrders.length,
          today: "Success",
        },
        {
          id: 4,
          status: "Total topup",
          progress: `${totalTopup.toLocaleString()}`,
          today: "Total topup",
        },
      ];

      setOrderStatus(orderStatusData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
      <div className="order-top-section text-center">
        <h4 className="mb-5 card-title">Order Status</h4>
        <div className="card-section mx-md-auto">
          <div className="row justify-content-center">
            {orderStatus.map((status) => (
              <div
                className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-5"
                key={status.id}
              >
                <div className="o-cards">
                  <h5 className={`txt-o-${status.status.toLowerCase()}`}>
                    {status.status}
                  </h5>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-6 mt-4">
                      <div
                        id={`o-progress-${status.status.toLowerCase()}`}
                        className=""
                      ></div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-6 mt-4 text-right">
                      <h4>{status.progress}</h4>
                      <h6>{status.today}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
