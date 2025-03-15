import { createContext, useEffect, useState } from "react";
import Header from "./components/Header";
import { getPage } from "./helper";
import { InvoiceProvider } from "./components/InvoiceContext";
import { Toaster } from "react-hot-toast";


export function getUrlParam() {
  const parts = location.hash.substring(1).split('/');
  return parts.length > 1 ? parts.slice(1).join('/') : null;
}

function App() {
  const [url, setUrl] = useState(location.hash.substring(1) || "/");

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setUrl(location.hash.substring(1));
    });
  }, []);

  const page = getPage(url);

  return (
    <>
      <InvoiceProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        <div className="container">
          <div className="page-component">
            {page}
          </div>
        </div>
      </InvoiceProvider>

    </>
  )
}

export default App;