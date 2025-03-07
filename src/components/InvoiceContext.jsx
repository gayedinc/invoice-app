import { createContext, useState, useEffect } from "react";
import NewAndEditInvoice from "./NewAndEditInvoice"

export const InvoiceContext = createContext(null);

export function InvoiceProvider({ children }) {
  const [invoiceData, setInvoiceData] = useState(() => {
    // İlk açılışta localStoragetan verileri al
    const storedInvoices = localStorage.invoiceData;
    return storedInvoices ? JSON.parse(storedInvoices) : [];
  });

  const [isEdit, setEdit] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // invoiceData her değiştiğinde localStorageı güncelle
  useEffect(() => {
    localStorage.invoiceData = JSON.stringify(invoiceData);
  }, [invoiceData]);

  console.log(invoiceData)

  return (
    <InvoiceContext.Provider
      value={{
        invoiceData, setInvoiceData, isEdit, setEdit, currentInvoice, setCurrentInvoice, isModalOpen, setIsModalOpen,
        isDesktop
      }}>
      {children}
      {isDesktop && isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <NewAndEditInvoice />
          </div>
        </div>
      )}
    </InvoiceContext.Provider>
  );
}