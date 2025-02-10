import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "../App";

export default function InvoiceDetails() {
  const { invoiceData } = useContext(PageContext);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // URL, örn. "#/invoice/XM7892" şeklinde
    // Hash'i "/" ile bölüp id'yi alıyoruz:
    const invoiceId = window.location.hash.split("/")[2]; // Örn: "XM7892"
    // İlgili faturayı bul:
    const foundInvoice = invoiceData.find((inv) => inv.id === invoiceId);
    setInvoice(foundInvoice);
  }, [invoiceData]);

  if (!invoice) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="go-back-btn-detail">
        <button onClick={() => (window.location.hash = "/")}>
          <img src="/img/back-arrow-icon.svg" alt="Back Arrow Icon" />
          Go back
        </button>
      </div>
      <div className="invoice-details-container">

        <div className="status-section">
          <h4>Status</h4>
          <span className={`invoice-status ${invoice.status.toLowerCase()}`}>
            <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4" cy="4" r="4" />
            </svg>
            {invoice.status}
          </span>
          <div className="footer-btns-details-tablet-desktop">
            <button className="edit-btn" type="button">Edit</button>
            <button className="delete-btn" type="button">Delete</button>
            <button className="mark-paid-btn" type="button">Mark as Paid</button>
          </div>
        </div>

        <div className="invoices-detail-contents">
          <div key={invoice.id} className="invoice-item">
            <h3 className="invoice-detail-id">
              <span>#</span>
              {invoice.id}
            </h3>
            <h4 className="detail-client-name">{invoice["client-name"]}</h4>
            <div className="detail-invoice-date">
              <h3>Invoice Date</h3>
              <span>{invoice["invoice-date"]}</span>
            </div>
            <div className="detail-total-amount">
              <h3>Grand Total</h3>
              <span>
                £ {Number(invoice["grandTotal"] || 0).toFixed(2)}
              </span>
            </div>
            {/* Bill From Section */}
            <div className="bill-from-details">
              <h3>Bill From</h3>
              <p>Street Address:{invoice["bill-from-streetAdress"]}</p>
              <p>City:{invoice["bill-from-city"]}</p>
              <p>Post Code:{invoice["bill-from-postcode"]}</p>
              <p>Country:{invoice["bill-from-country"]}</p>

              {/* Mobil ve Tablet için ayrı veriler */}
              {invoice["bill-from-city"] && (
                <p>City: {invoice["bill-from-city"]}</p>
              )}
              {invoice["bill-from-postcode"] && (
                <p>Post Code: {invoice["bill-from-postcode"]}</p>
              )}
              {invoice["bill-from-country"] && (
                <p>Country: {invoice["bill-from-country"]}</p>
              )}
            </div>

            {/* Bill To Section */}
            <div className="bill-to-details">
              <h3>Bill To</h3>
              <p>Client's Name:{invoice["client-name"]}</p>
              <p>Client's Email:{invoice["client-email"]}</p>
              <p>Street Address:{invoice["client-street"]}</p>
              <p>City:{invoice["bill-to-city"]}</p>
              <p>Post Code:{invoice["bill-to-postcode"]}</p>
              <p>Country:{invoice["bill-to-country"]}</p>
            </div>

            {/* Payment Terms Section */}
            <div className="payment-terms-details">
              <h3>Payment Terms</h3>
              <p>{invoice["paymentTerms"]}</p>
            </div>
          </div>
        </div>

      </div>
      <div className="footer-btns-details">
        <button className="edit-btn" type="button">Edit</button>
        <button className="delete-btn" type="button">Delete</button>
        <button className="mark-paid-btn" type="button">Mark as Paid</button>
      </div>
    </>
  );
}
