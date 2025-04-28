import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div className="lds-ring-container">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
