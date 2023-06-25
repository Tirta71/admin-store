import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Orders from "./pages/Orders";
import Customer from "./pages/Customer";
import WalletTopUp from "./pages/WalletTopUp";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/payment" element={<WalletTopUp />} />
      </Routes>
    </Router>
  );
}

export default App;
