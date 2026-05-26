import React, { useState, useEffect } from "react";
import Header from "./Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";
import Home from "./sec-links/Home";
import Products from "./sec-links/Products";
import Login from "./third-links/Login";
import Register from "./third-links/Register";
import Cart from "./sec-links/Cart";



export default function App() {
  const [data, sdata] = useState([]);
  useEffect(() => {
    fetch('https://fakestoreapi.com/products/')
      .then(res => res.json())
      .then((d) => sdata(d));



  }, []);
  return (
    <>

      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/Products" element={<Products data={data} />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Cart" element={<Cart data={data} />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  )
}