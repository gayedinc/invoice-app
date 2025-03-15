import React, { useContext, useEffect, useState } from "react";
import { InvoiceContext } from ".//InvoiceContext";
import NothingHere from "./HomePage";
import toast from "react-hot-toast"

export default function InvoiceDetails() {
  const { invoiceData, setInvoiceData, isEdit, setEdit, currentInvoice, setCurrentInvoice, isModalOpen, setIsModalOpen, isDesktop } = useContext(InvoiceContext);
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // URL, örn. "#/invoice/XM7892" şeklinde
    // Hash'i "/" ile bölüp id'yi alıyoruz:
    const invoiceId = window.location.hash.split("/")[2]; // Örn: "XM7892"

    // İlgili faturayı bul:
    const foundInvoice = invoiceData.find((inv) => inv.id === invoiceId);

    setInvoice(foundInvoice);
    setIsLoading(false);
  }, [invoiceData]);

  function handleEditClick() {
    setEdit(true);
    setCurrentInvoice(invoice);
    if (isDesktop) {
      setIsModalOpen(true); // modalı açmak için state kullanılıyor
    } else {
      window.location.hash = "#/new-invoice"; // mobilde yönlendirme
    }
  }

  function removeInvoice() {
    const invoiceId = window.location.hash.split("/")[2]; // Örn: "XM7892"

    const deletedInvoice = invoiceData.filter((invoice) => invoice.id !== invoiceId);

    setInvoiceData(deletedInvoice);
    window.location.hash = "/";
    toast.success("Invoice deleted successfully!");
  }

  return (
    <>
      {isLoading && <div className="loading">Loading...</div>}
      {invoice === null && !isLoading && <NothingHere />}
      {invoice && !isLoading &&
        <>
          <div className="invoice-details">
            <button className="go-back-btn-detail" onClick={() => (window.location.hash = "/")}>
              <img src="/img/back-arrow-icon.svg" alt="Back Arrow Icon" />
              Go back
            </button>
            <div className="invoice-details-container">

              <div className="status-section">
                <h4>Status</h4>
                <span className={`invoice-status ${invoice.status}`}>
                  <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  {invoice.status}
                </span>
                <div className="footer-btns-details-tablet-desktop">
                  <button className="edit-btn" type="button" onClick={handleEditClick}>Edit</button>
                  <button className="delete-btn" type="button" onClick={removeInvoice}>Delete</button>
                  <button className="mark-paid-btn" type="button">Mark as Paid</button>
                </div>
              </div>

              <div className="invoices-detail-contents">
                <div key={invoice.id} className="invoice-item-detail">
                  <div className="detail-title">
                    <h3 className="invoice-detail-id">
                      <span>#</span>
                      {invoice.id}
                    </h3>
                    <span className="detail-project-desc">{invoice["projectDescription"]}</span>
                  </div>
                  <div className="detail-adress">
                    <span>{invoice["billFromstreetAdress"]}</span>
                    <span>{invoice["billFromCity"]}</span>
                    <span>{invoice["billFromPostcode"]}</span>
                    <span>{invoice["billFromCountry"]}</span>
                  </div>
                  <div className="detail-info">
                    <div className="invoice-detail-date">
                      <span>Invoice Date</span>
                      <h4>{invoice["invoiceDate"]}</h4>
                    </div>
                    <div className="invoice-detail-payment-due">
                      <span>Payment Due</span>
                      <h4>{invoice["invoiceDate"]}</h4>
                    </div>
                    <div className="invoice-details-billto">
                      <span>Bill To</span>
                      <h4>{invoice["clientName"]}</h4>
                      <div className="detail-adress-billto">
                        <span>{invoice["clientStreet"]}</span>
                        <span>{invoice["billToCity"]}</span>
                        <span>{invoice["billToPostcode"]}</span>
                        <span>{invoice["billToCountry"]}</span>
                      </div>
                    </div>
                    <div className="detail-email">
                      <span>Send to</span>
                      <h4>{invoice["clientEmail"]}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item-detail-content">
                <h3>Item List</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items && invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemName}</td>
                        <td>{item.quantitiy}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantitiy * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
            <div className="footer-btns-details">
              <button className="edit-btn" type="button" onClick={handleEditClick}>Edit</button>
              <button className="delete-btn" type="button">Delete</button>
              <button className="mark-paid-btn" type="button">Mark as Paid</button>
            </div>
          </div>
        </>
      }
    </>
  );
}
