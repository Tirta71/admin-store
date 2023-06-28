/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../dataApi";
import Swal from "sweetalert2";

export default function OrderListing() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGameTitle, setFilterGameTitle] = useState("");
  const [currentPage, setCurrentPage] = useState({});
  const [currentOrders, setCurrentOrders] = useState({});

  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      const usersData = response.data;
      setUsers(usersData);
      const ordersPromises = usersData.map(async (user) => {
        // Delay setiap permintaan 500ms
        await new Promise((resolve) => setTimeout(resolve, 500));

        const userResponse = await axios.get(`${API_URL}/${user.id}/history`);
        return userResponse.data;
      });
      const ordersData = await Promise.all(ordersPromises);
      const allOrders = ordersData.flat();
      setOrders(allOrders);
      groupByGame(allOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const handleGameTitleFilter = (gameTitle) => {
    setFilterGameTitle(gameTitle);
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

  const filteredOrders = Object.entries(currentOrders).reduce(
    (filtered, [gameTitle, gameOrders]) => {
      const filteredGameOrders = gameOrders.filter((order) => {
        const statusCondition =
          filterStatus === "" ||
          (filterStatus === "Success" && order.status === true) ||
          (filterStatus === "Pending" && order.status === false);

        const gameTitleCondition =
          filterGameTitle === "" || gameTitle === filterGameTitle;

        return statusCondition && gameTitleCondition;
      });

      if (filteredGameOrders.length > 0) {
        filtered[gameTitle] = filteredGameOrders;
      }

      return filtered;
    },
    {}
  );

  const getCurrentOrders = (gameTitle) => {
    return filteredOrders[gameTitle] || [];
  };

  const handlePageChange = (pageNumber, gameTitle) => {
    setCurrentPage((prevState) => ({
      ...prevState,
      [gameTitle]: pageNumber,
    }));
  };

  const deleteOrder = async (userId, orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        dangerMode: true,
      });

      if (confirmation.isConfirmed) {
        await axios.delete(`${API_URL}/${userId}/history/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter(
            (order) => !(order.userId === userId && order.id === orderId)
          )
        );
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          const userIndex = updatedUsers.findIndex(
            (user) => user.id === userId
          );
          const userOrders = updatedUsers[userIndex]?.orders ?? [];
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            orders: userOrders.filter((order) => order.id !== orderId),
          };
          return updatedUsers;
        });
        Swal.fire("Deleted!", "", "success");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to delete data. Please try again. Error: ${error}`,
      });
    }
  };

  const changeStatus = async (userId, orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Pastikan data Sudah benar!!!",
        showCancelButton: true,
        confirmButtonText: "Save",
      });

      if (confirmation.isConfirmed) {
        await axios.put(`${API_URL}/${userId}/history/${orderId}`, {
          status: true,
        });
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order.userId === userId && order.id === orderId) {
              return { ...order, status: true };
            }
            return order;
          })
        );
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          const userIndex = updatedUsers.findIndex(
            (user) => user.id === userId
          );
          const userOrders = updatedUsers[userIndex]?.orders ?? [];
          const updatedUserOrders = userOrders.map((order) => {
            if (order.id === orderId) {
              return { ...order, status: true };
            }
            return order;
          });
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            orders: updatedUserOrders,
          };
          return updatedUsers;
        });
        Swal.fire("Pesanan Sudah di update", "", "success");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Gagal update data coba lagi ${error}`,
      });
    }
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

      <div className="mb-4">
        <h3>Filter by Game Title:</h3>
        <select
          className="form-control"
          value={filterGameTitle}
          onChange={(e) => handleGameTitleFilter(e.target.value)}
        >
          <option value="">All</option>
          {Object.keys(currentOrders).map((gameTitle) => (
            <option key={gameTitle} value={gameTitle}>
              {gameTitle}
            </option>
          ))}
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
                  {gameTitle === "Higgs Domino" && (
                    <>
                      <th>Username</th>
                      <th>Id Higs</th>
                      <th>Jumlah Koin</th>
                    </>
                  )}
                  {gameTitle === "Point Blank" && (
                    <>
                      <th>Id PB</th>
                      <th>Jumlah</th>
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
                      {gameTitle === "Higgs Domino" && (
                        <>
                          <td>{userData.usernameHiggs}</td>
                          <td>{userData.idHigs}</td>
                          <td>{order.jumlah}M</td>
                        </>
                      )}

                      {gameTitle === "Point Blank" && (
                        <>
                          <td>{userData.idPb}</td>
                          <td>{order.jumlah} Cash</td>
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
                          style={
                            order.status
                              ? { display: "none" }
                              : { display: "block" }
                          }
                        >
                          <i className="icon-search"></i> Change Status
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => deleteOrder(order.userId, order.id)}
                          style={
                            order.status
                              ? {
                                  display: "block",
                                  border: "none",
                                  padding: "0.5rem",
                                  borderRadius: "10px",
                                }
                              : { display: "none" }
                          }
                        >
                          Delete
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
