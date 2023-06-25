import React, { useState, useEffect } from "react";

export default function CardPayment() {
  const [paymentData, setPaymentData] = useState([
    {
      amount: "",
      name: "",
    },
    {
      amount: "",
      name: "",
    },
    {
      amount: "",
      name: "",
    },
  ]);

  useEffect(() => {
    fetch("https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user")
      .then((response) => response.json())
      .then((userData) => {
        // Mendapatkan array userId dari data user
        const userIds = userData.map((user) => user.id);

        // Menghitung total amount dari semua user
        const totalAmount = userData.reduce((total, user) => {
          return total + parseFloat(user.wallet.amount);
        }, 0);

        // Mengambil data transaksi untuk setiap user
        const fetchTransactionData = userIds.map((userId) =>
          fetch(
            `https://6491b88b2f2c7ee6c2c8cc9b.mockapi.io/user/${userId}/walletTransaction`
          ).then((response) => response.json())
        );

        // Menunggu semua permintaan fetch selesai
        Promise.all(fetchTransactionData)
          .then((transactionData) => {
            // Menggabungkan data transaksi dari semua user menjadi satu array
            const allTransactions = transactionData.flat();

            const successCount = allTransactions.filter(
              (transaction) => transaction.status === true
            ).length;

            const pendingCount = allTransactions.filter(
              (transaction) => transaction.status === false
            ).length;

            const updatedPaymentData = [
              {
                amount: `Rp.${totalAmount.toLocaleString()}`, // Format total amount
                name: "Total Amount",
              },
              {
                amount: successCount.toString(),
                name: "Success",
              },
              {
                amount: pendingCount.toString(),
                name: "Pending",
              },
            ];
            setPaymentData(updatedPaymentData);
          })
          .catch((error) => {
            console.log("Error fetching transaction data:", error);
          });
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }, []);

  const totalAmount = paymentData[0].amount; // Ambil total amount dari data pada indeks 0

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing text-center">
      <div className="payment-top-section">
        <h4 className="mb-5 card-title">Payments</h4>
        <div className="card-section mx-md-auto">
          <div className="row mt-5 justify-content-center">
            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-5">
              <div className="p-cards">
                <i className="ico-net-bnk flaticon-computer-2 mb-4"></i>
                <h5>{totalAmount}</h5>
                <h5>{paymentData[0].name}</h5>
              </div>
            </div>
            {paymentData.slice(1).map((payment, index) => (
              <div
                className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12 mb-5"
                key={index + 1}
              >
                <div className="p-cards">
                  {index === 0 && (
                    <i className="ico-c-d-card flaticon-credit-card-1 mb-4"></i>
                  )}
                  {index === 1 && (
                    <i className="ico-cash flaticon-dollar-coin mb-4"></i>
                  )}
                  <h5>{payment.amount}</h5>
                  <h5>{payment.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
