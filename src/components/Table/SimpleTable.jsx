import axios from "axios";
import React, { useEffect, useState } from "react";
import GameTitle from "./GameTitle";

export default function SimpleTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGame, setFilterGame] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, filterStatus, filterGame]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/payment"
      );
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusButtonClick = async (index) => {
    try {
      const updatedData = [...data];
      updatedData[index].status = !updatedData[index].status;
      setData(updatedData);

      const updatedItem = updatedData[index];
      await axios.put(
        `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/payment/${updatedItem.id}`,
        updatedItem
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const handleFilterStatusChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
  };

  const handleFilterGameChange = (e) => {
    const game = e.target.value;
    setFilterGame(game);
  };

  const filterData = () => {
    let filteredData = data;

    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      const status = filterStatus === "success" ? true : false;
      filteredData = filteredData.filter((item) => item.status === status);
    }

    if (filterGame !== "all") {
      filteredData = filteredData.filter((item) => item.title === filterGame);
    }

    setFilteredData(filteredData);
  };

  const gameTitles = [...new Set(data.map((item) => item.title))];

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="col-12 layout-spacing">
      <div className="statbox widget box box-shadow">
        <div className="widget-header">
          <div className="row">
            <div className="col-xl-12 col-md-12 col-sm">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <h4>Transaction Guest</h4>
              </div>
            </div>
          </div>
          <div className="widget-content widget-content-area">
            <div className="table-responsive">
              <div className="search-input mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Transaction ID"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="filter-input mb-3">
                <label htmlFor="statusFilter">Status:</label>
                <select
                  id="statusFilter"
                  className="form-control"
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                >
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="filter-input mb-3">
                <label htmlFor="gameFilter">Game:</label>
                <select
                  id="gameFilter"
                  className="form-control"
                  value={filterGame}
                  onChange={handleFilterGameChange}
                >
                  <option value="all">All</option>
                  {gameTitles.map((title, index) => (
                    <option value={title} key={index}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <div className="rows-per-page">
                  <label htmlFor="rowsPerPage">Rows per page:</label>
                  <select
                    id="rowsPerPage"
                    className="form-control"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <GameTitle
                handleStatusButtonClick={handleStatusButtonClick}
                currentRows={currentRows}
              />
              {/* Pagination */}
              <div className="pagination-container">
                <div className="row">
                  <div className="col-md-6">
                    <div className="pagination">
                      <span className="page-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          handlePageChange(
                            currentPage > 1 ? currentPage - 1 : 1
                          )
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          handlePageChange(
                            currentPage < totalPages
                              ? currentPage + 1
                              : totalPages
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
