import { createContext, useEffect, useState } from "react";
import Header from "./components/Header";
import { getPage } from "./helper";

export const PageContext = createContext(null); // sayfa geçişi ve yönetimi için useContext

export function getUrlParam() {
  const parts = location.hash.substring(1).split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : null;
}

function App() {
  const [url, setUrl] = useState(location.hash.substring(1) || "/");
  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setUrl(location.hash.substring(1));
    });
  }, []);

  const page = getPage(url);

  return (
    <>
      <Header />
      <PageContext.Provider value={{ page, invoiceData, setInvoiceData }}>
        <div className="container">
          <div className="page-component">
            {page}
          </div>
        </div>
      </PageContext.Provider>
    </>
  )
}

export default App;