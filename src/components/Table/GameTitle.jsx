import React from "react";

export default function GameTitle({ handleStatusButtonClick, currentRows }) {
  return (
    <>
      <table className="table table-bordered mb-4">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Game</th>
            <th>Date</th>
            <th>Jumlah</th>
            <th>Data</th>
            <th>Total Price</th>
            <th>Payment</th>
            <th className="text-center">Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((item, index) => (
            <tr key={index}>
              <td>{item.transactionId}</td>
              <td>{item.title}</td>
              <td>{item.currentDate}</td>
              <td>{item.selectedItem.jumlah}</td>

              {item.title === "Pubg Mobile" && <td>{item.userData.idGame}</td>}
              {item.title === "Mobile Legend" && (
                <td>
                  {item.userData.username} | {item.userData.userId}(
                  {item.userData.serverId})
                </td>
              )}
              {item.title === "Genshin Impact" && (
                <td>
                  {item.userData.playerName} | ({item.userData.server})
                </td>
              )}
              {item.title === "Free Fire" && <td>{item.userData.idGame}</td>}
              {item.title === "Higgs Domino" && (
                <td>
                  {item.userData.usernameHiggs} | {item.userData.idHigs}
                </td>
              )}
              {item.title === "Valorant" && <td>{item.userData.playerName}</td>}
              {item.title === "Call Of Duty" && <td>{item.userData.idCod}</td>}
              {item.title === "Arena Of Valor" && (
                <td>{item.userData.idAov}</td>
              )}
              {item.title === "League Of Legend" && (
                <td>{item.userData.idGame}</td>
              )}
              {item.title === "Point Blank" && <td>{item.userData.idPb}</td>}

              <td>Rp. {item.formattedPrice}</td>
              <td>{item.selectedPayment.name}</td>
              <td className="text-center">
                <span className={`text-${item.status ? "success" : "danger"}`}>
                  {item.status ? "Success" : "Pending"}
                </span>
              </td>
              <td className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => handleStatusButtonClick(index)}
                >
                  Change Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
