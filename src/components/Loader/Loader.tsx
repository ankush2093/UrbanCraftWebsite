import React from "react";
import "@/styles/loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader_wrapper">
      <div className="dot_loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Loader;
