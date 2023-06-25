import React, { useEffect, useState } from "react";
import { API_URL } from "../../dataApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TableCustomer() {
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomerData(); // Fetch initial data

    const interval = setInterval(fetchCustomerData, 5000); // Fetch data every 5 seconds (adjust as needed)

    return () => {
      clearInterval(interval); // Clean up the interval when the component unmounts
    };
  }, []);

  const fetchCustomerData = () => {
    fetch(`${API_URL}`)
      .then((response) => response.json())
      .then((data) => setCustomerData(data))
      .catch((error) => console.log(error));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCustomerData = customerData.filter(
    (customer) =>
      customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (customerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Data will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          fetch(`${API_URL}/${customerId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (response.ok) {
                // Remove the deleted customer from customerData state
                setCustomerData((prevData) =>
                  prevData.filter((customer) => customer.id !== customerId)
                );
                toast.success("Customer deleted successfully");
                console.log("Customer deleted successfully");
              } else {
                toast.error("Failed to delete customer");
                console.log("Failed to delete customer");
              }
            })
            .catch((error) => {
              toast.error("Error deleting customer");
              console.log("Error deleting customer:", error);
            });
        } catch (error) {
          toast.error("Error deleting customer");
          console.log("Error deleting customer:", error);
        }
      }
    });
  };
  return (
    <div className="row" id="cancel-row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
        <div className="statbox widget box box-shadow">
          <div className="widget-header">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <h4>Customer Information Details</h4>
              </div>
            </div>
          </div>

          <div className="widget-content widget-content-area">
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search Customer"
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginTop: "5px",
                marginBottom: "20px",
              }}
            />

            <div className="table-responsive mb-4">
              <table
                id="ecommerce-product-customers"
                className="table table-bordered table-hover"
              >
                <thead>
                  <tr>
                    <th className="checkbox-column">Id User</th>
                    <th>Customers</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Wallet</th>
                    <th className="">Status</th>
                    <th className="">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomerData.map((customer, index) => (
                    <tr key={customer.id}>
                      <td className="checkbox-column">{index + 1}</td>
                      <td className="">
                        <a
                          className="product-list-img"
                          href="javascript: void(0);"
                        >
                          <img src={customer.image} alt="product" />
                        </a>
                      </td>
                      <td className={`customer-name-${index + 1}`}>
                        {customer.username}
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.password}</td>
                      <td>Rp.{customer.wallet.amount.toLocaleString()}</td>
                      <td>
                        <div className="d-flex">
                          <div
                            className={`align-self-center d-m-${
                              customer.isLogin ? "success" : "danger"
                            } mr-1 data-marker`}
                          ></div>
                          <span
                            className={`label label-${
                              customer.isLogin ? "success" : "danger"
                            }`}
                          >
                            {customer.isLogin ? "Log In" : "Not Log In"}
                          </span>
                        </div>
                      </td>
                      <td className="">
                        <ul className="table-controls">
                          <li>
                            <a
                              href="javascript:void(0);"
                              data-toggle="tooltip"
                              data-placement="top"
                              title="Delete"
                              onClick={() => handleDelete(customer.id)}
                            >
                              <i className="flaticon-delete-5"></i>
                            </a>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
