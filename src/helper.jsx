import HomePage from "./components/HomePage";
import InvoiceDetails from "./components/InvoiceDetails";
import NewAndEditInvoice from "./components/NewAndEditInvoice";

const routers = [
  {
    url: "/",
    component: <HomePage />
  },
  {
    url: "/invoice",
    component: <InvoiceDetails />
  },
  {
    url: "/edit-invoice",
    component: <NewAndEditInvoice />
  },
  {
    url: "/new-invoice",
    component: <NewAndEditInvoice />
  },
]

export function getPage(url) {
  return routers.slice().reverse().find(x => url.startsWith(x.url))?.component;
}