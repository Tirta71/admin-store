import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function TablePayment() {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const MAX_VISIBLE_PAGES = 5;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user"
      );
      const usersData = await response.json();
      setUsers(usersData);

      const paymentPromises = usersData.map(async (user) => {
        const paymentResponse = await fetch(
          `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user/${user.id}/walletTransaction`
        );
        const paymentData = await paymentResponse.json();
        return paymentData;
      });

      const paymentsData = await Promise.all(paymentPromises);
      const allPayments = paymentsData.flat();

      setPayments(allPayments);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsername = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "";
  };

  const changeStatus = async (userId, orderId) => {
    try {
      const paymentIndex = payments.findIndex(
        (payment) => payment.userId === userId && payment.id === orderId
      );

      if (paymentIndex === -1) {
        console.log("Payment not found");
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Pastikan Pengguna sudah transfer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      });

      if (result.isConfirmed) {
        // Buat salinan objek pembayaran yang akan diubah
        const updatedPayment = { ...payments[paymentIndex] };

        // Ubah status menjadi "Approved"
        updatedPayment.status = true;

        // Lakukan permintaan PUT ke endpoint API untuk mengubah status pembayaran
        await axios.put(
          `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user/${userId}/walletTransaction/${orderId}`,
          updatedPayment
        );

        // Update the amount in the API based on userId
        const userResponse = await axios.get(
          `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user/${userId}`
        );
        const userData = userResponse.data;
        const updatedAmount =
          parseFloat(userData.wallet.amount) + parseFloat(updatedPayment.price);

        await axios.put(
          `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user/${userId}`,
          { wallet: { amount: updatedAmount } }
        );

        // Perbarui state pembayaran dengan pembayaran yang telah diubah
        setPayments((prevState) => {
          const updatedPayments = [...prevState];
          updatedPayments[paymentIndex] = updatedPayment;
          return updatedPayments;
        });

        Swal.fire(
          "Success",
          "Saldo Wallet Pengguna telah di tambahkan",
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterPayments = () => {
    if (selectedStatus === "All") {
      return payments;
    } else {
      return payments.filter((payment) =>
        selectedStatus === "Pending"
          ? !payment.status
          : selectedStatus === "Approved"
          ? payment.status
          : null
      );
    }
  };

  // Menghitung jumlah halaman
  const totalPages = Math.ceil(filterPayments().length / rowsPerPage);

  // Mengubah halaman saat ini
  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Menghitung indeks halaman pertama dan terakhir yang akan ditampilkan dalam navigasi halaman
  const getPaginationRange = () => {
    const totalPages = Math.ceil(filterPayments().length / rowsPerPage);
    let startPage, endPage;

    if (totalPages <= MAX_VISIBLE_PAGES) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxVisiblePagesBeforeCurrentPage = Math.floor(
        MAX_VISIBLE_PAGES / 2
      );
      const maxVisiblePagesAfterCurrentPage =
        Math.ceil(MAX_VISIBLE_PAGES / 2) - 1;

      if (currentPage <= maxVisiblePagesBeforeCurrentPage) {
        startPage = 1;
        endPage = MAX_VISIBLE_PAGES;
      } else if (currentPage + maxVisiblePagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - MAX_VISIBLE_PAGES + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxVisiblePagesBeforeCurrentPage;
        endPage = currentPage + maxVisiblePagesAfterCurrentPage;
      }
    }

    return { startPage, endPage };
  };

  // Mengatur indeks awal dan akhir data yang akan ditampilkan pada halaman saat ini
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filterPayments().slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
      <div className="statbox widget box box-shadow">
        <div className="widget-header">
          <div className="row">
            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
              <h4>View Payments</h4>
            </div>
          </div>
        </div>
        <div className="widget-content widget-content-area">
          <div className="table-responsive mb-4">
            <div className="status-filter mb-3">
              <label htmlFor="statusFilter">Status:</label>
              <select
                id="statusFilter"
                className="form-control"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <table
              id="ecommerce-product-view"
              className="table table-bordered table-hover"
            >
              <thead>
                <tr>
                  <th>UserId</th>
                  <th>User Name</th>
                  <th>Order Id</th>
                  <th>Purchase On</th>
                  <th>Total Top Up</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.userId}</td>
                    <td>{getUsername(payment.userId)}</td>
                    <td>{payment.id}</td>
                    <td>{payment.date}</td>
                    <td>Rp. {parseInt(payment.price).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          payment.status ? "badge-success" : "badge-danger"
                        }`}
                      >
                        {payment.status ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="align-center">
                      <button
                        type="button"
                        className="btn btn-default btn-sm"
                        onClick={() => changeStatus(payment.userId, payment.id)}
                      >
                        <i className="icon-search"></i> Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {totalPages > 1 && (
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => changePage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    getPaginationRange().startPage - 1,
                    getPaginationRange().endPage
                  )
                  .map((pageNumber) => (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                {totalPages > 1 && (
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => changePage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
