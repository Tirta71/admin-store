import React from "react";

export default function PageHeaders({ item }) {
  return (
    <div className="page-header">
      <div className="page-title">
        <h3>{item.title}</h3>
        <div className="crumbs">
          <ul id="breadcrumbs" className="breadcrumb">
            <li>
              <a href="index.html">
                <i className="flaticon-home-fill"></i>
              </a>
            </li>
            <li>
              <a href="#">{item.store}</a>
            </li>
            <li className="active">
              <a href="#">{item.title}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
