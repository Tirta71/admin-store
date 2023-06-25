import React, { useEffect, useState } from "react";
import { getStatusBadgeClass } from "../../utils/Get status Badge/GetStatusBadge";
import axios from "axios";
import { API_URL } from "../../../dataApi";

export default function OrderListing() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      const usersData = response.data;
      setUsers(usersData);
      const ordersPromises = usersData.map(async (user) => {
        const userResponse = await axios.get(`${API_URL}/${user.id}/history`);
        return userResponse.data;
      });
      const ordersData = await Promise.all(ordersPromises);
      const allOrders = ordersData.flat();
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const changeStatus = async (userId, orderId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${userId}/history/${orderId}`,
        { status: true }
      );
      // Update status in the local state
      const updatedOrders = orders.map((order) => {
        if (order.userId === userId && order.id === orderId) {
          return { ...order, status: true };
        }
        return order;
      });
      setOrders(updatedOrders);
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const filteredOrders = filterStatus
    ? orders.filter(
        (order) =>
          (order.status === true && filterStatus === "Success") ||
          (order.status === false && filterStatus === "Pending")
      )
    : orders;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
      <div className="statbox widget box box-shadow">
        <div className="widget-header">
          <div className="row">
            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
              <h4>Order Listing</h4>
            </div>
          </div>
        </div>
        <div className="widget-content widget-content-area">
          <div className="table-responsive mb-4">
            <table
              id="ecommerce-order-list"
              className="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th className="checkbox-column"> UserId </th>
                  <th>Username</th>
                  <th>Order Id</th>
                  <th>Purchased On</th>
                  <th>Name Game</th>
                  <th>Purchased Price</th>
                  <th className="align-center" style={{ cursor: "pointer" }}>
                    <span
                      className={`status-filter ${
                        filterStatus === "Success" ? "active" : ""
                      }`}
                      onClick={() => handleStatusFilter("Success")}
                    >
                      Success
                    </span>{" "}
                    |{" "}
                    <span
                      className={`status-filter ${
                        filterStatus === "Pending" ? "active" : ""
                      }`}
                      onClick={() => handleStatusFilter("Pending")}
                    >
                      Pending
                    </span>{" "}
                    |{" "}
                    <span
                      className={`status-filter ${
                        !filterStatus ? "active" : ""
                      }`}
                      onClick={() => handleStatusFilter("")}
                    >
                      All
                    </span>
                  </th>
                  <th className="align-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => {
                  const user = users.find((user) => user.id === order.userId);
                  return (
                    <tr key={order.id}>
                      <td className="checkbox-column">{order.userId}</td>
                      <td>{user.username}</td>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.title}</td>
                      <td>Rp. {parseInt(order.price).toLocaleString()}</td>
                      <td className="align-center">
                        <span
                          className={`badge ${getStatusBadgeClass(
                            order.status === true ? "Approved" : "Pending"
                          )}`}
                        >
                          {order.status === true ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="align-center">
                        <button
                          type="button"
                          className="btn btn-default btn-sm"
                          onClick={() => changeStatus(order.userId, order.id)}
                        >
                          <i className="icon-search"></i> Change Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`page-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
