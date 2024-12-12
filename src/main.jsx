import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client"; 
import App from "./App";
import { RecoilRoot } from "recoil";
import "./index.css"; // optional: if you use global styles


createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
)
