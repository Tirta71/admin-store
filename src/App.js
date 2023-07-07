import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Orders from "./pages/Orders";
import Customer from "./pages/Customer";
import WalletTopUp from "./pages/WalletTopUp";
import NoLogin from "./pages/NoLogin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/payment" element={<WalletTopUp />} />
        <Route path="/no-login" element={<NoLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
