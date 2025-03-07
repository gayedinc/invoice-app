import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from "./InvoiceContext";

export default function HomePage() {
  const { invoiceData, setInvoiceData, isEdit, setEdit, currentInvoice,
    setCurrentInvoice, isModalOpen, setIsModalOpen, isDesktop } = useContext(InvoiceContext);
  const [dropdown, setDropdown] = useState(false);

  function handleNewInvoice() {

    if (isDesktop) {
      setIsModalOpen(true);
    }
    else {
      window.location.hash = "/new-invoice";
    }
    setEdit(false);
  }

  return (
    <>
      <div className="home-page-header">
        <div className="home-page-title">
          <h1>Invoices</h1>
          <h4>{invoiceData.length > 0 ? `${invoiceData.length} invoices` : "No invoices"}</h4>
        </div>
        <div className="home-page-filter-new">
          <button className="filter-dropdown-btn" onClick={() => setDropdown(!dropdown)}>
            {isDesktop ? <span>Filter by status</span> : <span>Filter</span>}
            <img src="/img/dropdown-arrow-icon.svg" alt="Dropdown Icon" />
          </button>
          {dropdown && (
            <div className="filter-dropdown-menu">
              <label><input type="checkbox" /> Draft</label>
              <label><input type="checkbox" /> Pending</label>
              <label><input type="checkbox" /> Paid</label>
            </div>
          )}
          <div className="home-page-new-button">
            <button onClick={handleNewInvoice}>
              <img src="/img/new-icon.svg" alt="New Icon" />
              {isDesktop ? <span>New Invoice</span> : <span>New</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="invoice-page">
        {invoiceData && invoiceData.length > 0 ? <Invoices invoiceData={invoiceData} /> : <NothingHere />}
      </div>
    </>
  );
}

function Invoices({ invoiceData }) {
  return (
    <div className="invoices-contents">
      {invoiceData.map((invoice) => (
        <div key={invoice.id} className="invoice-item" onClick={() => (window.location.hash = `/invoice/${invoice.id}`)}>
          <h3 className="invoice-id">
            <span>#</span>
            {invoice.id}
          </h3>
          <h4 className="client-name">{invoice["clientName"]}</h4>
          <p className="due-date">Due {invoice["invoiceDate"]}</p>
          <span className={`invoice-status ${invoice.status.toLowerCase()}`}>
            <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4" cy="4" r="4" />
            </svg>
            {invoice.status}
          </span>
          <p className="total-amount">
            £ {Number(invoice["grandTotal"] || 0).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

function NothingHere() {
  return (
    <div className="nothing-here-contents">
      <img src="/img/nothing-here-image.png" alt="No Invoices" />
      <div className="nothing-here-content">
        <h1>There is nothing here</h1>
        <h4>
          Create an invoice by clicking the
          <strong> New Invoice</strong> button and get started
        </h4>
      </div>
    </div>
  );
}
