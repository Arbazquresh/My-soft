import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { Setting } from "./Setting";
import { Addcategory } from "./Addcategory";
import { Update } from "./Update";
import { Report } from "./Reports/Report";
import { Addproduct } from "./AddProduct/Addproduct";

export const Landing = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product" element={<Addproduct />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/cat" element={<Addcategory />} />
          <Route path="/report" element={<Report />} />
          <Route path="/edit/:categoryId" element={<Update />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
