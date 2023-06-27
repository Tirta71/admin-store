import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../dataApi";

export default function OrderListing() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState({});
  const [currentOrders, setCurrentOrders] = useState({});

  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      const usersData = response.data;
      setUsers(usersData);
      const ordersPromises = usersData.map(async (user) => {
        const userResponse = await axios.get(`${API_URL}/${user.id}/history`);
        return userResponse.data;
      });
      const ordersData = await Promise.all(ordersPromises);
      const allOrders = ordersData.flat();
      setOrders(allOrders);
      groupByGame(allOrders);
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

  const groupByGame = (ordersData) => {
    const groupedOrders = {};
    ordersData.forEach((order) => {
      if (groupedOrders[order.title]) {
        groupedOrders[order.title].push(order);
      } else {
        groupedOrders[order.title] = [order];
      }
    });
    setCurrentPage({});
    setCurrentOrders(groupedOrders);
  };

  const filteredOrders = filterStatus
    ? Object.entries(currentOrders).reduce(
        (filtered, [gameTitle, gameOrders]) => {
          const filteredGameOrders = gameOrders.filter((order) =>
            filterStatus === "All"
              ? true
              : filterStatus === "Success"
              ? order.status === true
              : order.status === false
          );
          if (filteredGameOrders.length > 0) {
            filtered[gameTitle] = filteredGameOrders;
          }
          return filtered;
        },
        {}
      )
    : currentOrders;

  const getCurrentOrders = (gameTitle) => {
    return filteredOrders[gameTitle] || [];
  };

  const handlePageChange = (pageNumber, gameTitle) => {
    setCurrentPage((prevState) => ({
      ...prevState,
      [gameTitle]: pageNumber,
    }));
  };

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
      <div className="mb-4">
        <h3>Filter by Status:</h3>
        <select
          className="form-control"
          value={filterStatus}
          onChange={(e) => handleStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {Object.entries(filteredOrders).map(([gameTitle, gameOrders]) => {
        const currentPageNumber = currentPage[gameTitle] || 1;
        const startIndex = (currentPageNumber - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const selectedOrders = gameOrders.slice(startIndex, endIndex);

        return (
          <div
            key={gameTitle}
            className="mb-4"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "10px",
            }}
          >
            <h3>{gameTitle}</h3>
            <table
              id={`ecommerce-order-list-${gameTitle}`}
              className="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th className="checkbox-column">UserId</th>
                  <th>Username</th>
                  <th>Order Id</th>
                  <th>Purchased On</th>
                  <th>Name Game</th>
                  <th>Purchased Price</th>
                  {gameTitle === "Mobile Legend" && (
                    <>
                      <th>Username(Game) </th>
                      <th>Server ID</th>
                      <th>Jumlah Diamond</th>
                    </>
                  )}
                  {gameTitle === "Valorant" && (
                    <>
                      <th>Id Riot</th>
                      <th>Jumlah VP</th>
                    </>
                  )}
                  {gameTitle === "Genshin Impact" && (
                    <>
                      <th>ID Game</th>
                      <th>Server Game</th>
                      <th>Jumlah Genesis</th>
                    </>
                  )}
                  {gameTitle === "Pubg Mobile" && (
                    <>
                      <th>ID Game</th>
                      <th>Jumlah UC</th>
                    </>
                  )}
                  <th className="align-center" style={{ cursor: "pointer" }}>
                    Status
                  </th>
                  <th className="align-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrders.map((order) => {
                  const user = users.find((user) => user.id === order.userId);
                  const userData = order.userData || {}; // Tambahkan pengecekan jika userData tidak ada

                  return (
                    <tr key={order.id}>
                      <td className="checkbox-column">{order.userId}</td>
                      <td>{user?.username}</td>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.title}</td>
                      <td>Rp. {parseInt(order.price).toLocaleString()}</td>
                      {gameTitle === "Mobile Legend" && (
                        <>
                          <td>{userData?.username}</td>

                          <td>
                            {userData.userId}
                            {userData.serverId && `(${userData.serverId})`}
                          </td>
                          <td>{order.jumlah} Diamond</td>
                        </>
                      )}
                      {gameTitle === "Valorant" && (
                        <>
                          <td>{userData.playerName}</td>
                          <td>{order.jumlah} VP</td>
                        </>
                      )}
                      {gameTitle === "Genshin Impact" && (
                        <>
                          <td>{userData.playerName}</td>
                          <td>{userData.server}</td>
                          <td>{order.jumlah} Genesis</td>
                        </>
                      )}
                      {gameTitle === "Pubg Mobile" && (
                        <>
                          <td>{userData.idGame}</td>
                          <td>{order.jumlah} UC</td>
                        </>
                      )}
                      <td className="align-center">
                        <span
                          className={`badge ${
                            order.status === true
                              ? "badge-success"
                              : "badge-warning"
                          }`}
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
            <div className="pagination">
              {Array.from(
                {
                  length: Math.ceil(gameOrders.length / ordersPerPage),
                },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`page-link ${
                    currentPageNumber === pageNumber ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNumber, gameTitle)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
