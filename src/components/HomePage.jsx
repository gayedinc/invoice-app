import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../App";
import NewAndEditInvoice from "./NewAndEditInvoice";

export default function HomePage() {
  const [dropdown, setDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { invoiceData, setInvoiceData } = useContext(PageContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <button onClick={() => (isDesktop ? setIsModalOpen(true) : (window.location.hash = "/new-invoice"))}>
              <img src="/img/new-icon.svg" alt="New Icon" />
              {isDesktop ? <span>New Invoice</span> : <span>New</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="invoice-page">
        {invoiceData && invoiceData.length > 0 ? <Invoices invoiceData={invoiceData} /> : <NothingHere />}
      </div>
      {isDesktop && isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <NewAndEditInvoice isDesktop={isDesktop} />
          </div>
        </div>
      )}
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
          <h4 className="client-name">{invoice["client-name"]}</h4>
          <p className="due-date">Due {invoice["invoice-date"]}</p>
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
