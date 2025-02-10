import { useState, useContext, useRef } from "react";
import { PageContext } from "../App";

// Rastgele 4 rakam üretme fonksiyonu
function generateXMString() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `XM${randomNumber}`;
}

const newItemObj = {
  itemName: "",
  quantitiy: 0,
  price: 0,
  total: 0,
};

export default function NewAndEditInvoice({ isModalOpen }) {

  const { invoiceData, setInvoiceData } = useContext(PageContext);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Net 30 Days");
  const [isEdit, setEdit] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [items, setItems] = useState([newItemObj]);

  const [totalPrice, setTotalPrice] = useState(0);

  const handleQtyPriceChange = (index) => {
    const updatedItems = [...items];

    const qty = updatedItems[index].quantitiy;
    const price = updatedItems[index].price;

    updatedItems[index].total = qty * price;

    setItems(updatedItems);
    updateTotalPrice(updatedItems);
  };

  const addNewItem = () => {
    const newItem = newItemObj;
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index) => {
    console.log("Reset fonksiyonu çağrıldı, index:", index);
    const deletedItems = [...items];
    deletedItems[index] = { ...newItemObj }
    setItems(deletedItems);
  };

  const updateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.total, 0);
    setTotalPrice(total);
  };

  const options = ["Net 1 Day", "Net 7 Days", "Net 14 Days", "Net 30 Days"];

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const newInvoice = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formObj = Object.fromEntries(form);

    const newInvoiceData = {
      ...formObj,
      id: generateXMString(),
      status: "pending",
      paymentTerms: selectedOption,
    };

    setInvoiceData([...invoiceData, newInvoiceData]);
    console.log("Yeni Fatura:", newInvoiceData);
    e.target.reset();
  };

  const updatedInvoice = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formObj = Object.fromEntries(form);

    const updatedInvoiceData = {
      ...currentInvoice,
      ...formObj,
      paymentTerms: selectedOption,
    };

    setInvoiceData(invoiceData.map(inv => inv.id === currentInvoice.id ? updatedInvoiceData : inv));
    console.log("Güncellenmiş Fatura:", updatedInvoiceData);

    setEdit(false);
    setCurrentInvoice(null);
    e.target.reset();
  };

  return (
    <>
      {!isModalOpen && <div className="go-back-btn">
        <button onClick={() => location.hash = "/"}>
          <img src="/img/back-arrow-icon.svg" alt="Back Arrow Icon" />
          Go back
        </button>
      </div>}

      <div className="form-section">
        {isEdit ? <h2>Edit {currentInvoice?.id}</h2> : <h2>New Invoice</h2>}
        <form onSubmit={isEdit ? updatedInvoice : newInvoice} autoComplete="off">
          <div className="bill-from">
            <h3>Bill From</h3>
            <label>Street Address</label>
            <input type="text" name="bill-from-streetAdress" required />

            <div className="city-post-country">
              <div className="city">
                <label>City</label>
                <input type="text" name="bill-from-city" />
              </div>

              <div className="postcode">
                <label>Post Code</label>
                <input type="text" name="bill-from-postcode" />
              </div>

              <div className="country">
                <label>Country</label>
                <input type="text" name="bill-from-country" />
              </div>
            </div>

          </div>

          <div className="bill-to">
            <h3>Bill To</h3>
            <label>Client's Name</label>
            <input type="text" name="client-name" required />

            <label>Client's Email</label>
            <input type="email" name="client-email" required />

            <label>Street Address</label>
            <input type="text" name="client-street" required />

            <div className="city-post-country">
              <div className="city">
                <label>City</label>
                <input type="text" name="bill-to-city" />
              </div>

              <div className="postcode">
                <label>Post Code</label>
                <input type="text" name="bill-to-postcode" />
              </div>

              <div className="country">
                <label>Country</label>
                <input type="text" name="bill-to-country" />
              </div>
            </div>
          </div>

          <div className="date-terms-desc">
            <label>Invoice Date</label>
            <input type="date" name="invoice-date" required />

            <div className="dropdown">
              <label>Payment Terms</label>
              <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{selectedOption}</span>
                <img
                  src="/img/dropdown-arrow-icon.svg"
                  alt="Dropdown Icon"
                  className={`arrow ${isOpen ? "open" : ""}`}
                />
              </div>
              {isOpen && (
                <div className="dropdown-menu">
                  {options.map((option) => (
                    <div
                      key={option}
                      className={`dropdown-item ${selectedOption === option ? "selected" : ""
                        }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label>Project Description</label>
            <input type="text" name="project-description" required />
          </div>

          <div className="item-list">
            <h4>Item List</h4>
            {items.map((item, index) => (
              <div key={index} className="item-info">
                <div className="item-name">
                  <label>Item Name</label>
                  <input type="text" name="item-name"
                    value={item.itemName}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].itemName = e.target.value;
                      setItems(updatedItems);
                    }} required />
                </div>

                <div className="item-qty">
                  <label>Qty.</label>
                  <input type="number" name="item-qty"
                    value={item.quantitiy === 0 ? '' : item.quantitiy}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].quantitiy = parseInt(e.target.value);
                      handleQtyPriceChange(index);
                    }} required />
                </div>

                <div className="item-price">
                  <label>Price</label>
                  <input type="number" step="0.01" name="item-price"
                    value={item.price === 0 ? '' : item.price}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].price = parseFloat(e.target.value);
                      handleQtyPriceChange(index);
                    }} required />
                </div>

                <div className="item-total-price">
                  <label>Total</label>
                  <input type="number" value={item.total} disabled name="total" />
                </div>

                <button type="button" onClick={() => handleDeleteItem(index)}>
                  <img src="/img/trash-icon.svg" alt="Trash Icon" />
                </button>
              </div>
            ))}

            <div className="add-new-item-btn">
              <button type="button" onClick={addNewItem}>+ Add New Item</button>
            </div>
          </div>

          {isEdit ?

            <div className="footer-btns-edit">
              <button className="cancel-btn" type="button">Cancel</button>
              <button className="save-changes-btn" type="button">Save Changes</button>
            </div>
            :
            <div className="footer-btn-new-tab-desk">
              <button className="discard-btn" type="button">Discard</button>
              <div className="footer-btn-right-side">
                <button className="save-btn" type="button">Save as Draft</button>
                <button className="save-send-btn" type="submit">Save & Send</button>
              </div>
            </div>
          }
        </form>
      </div>

    </>
  )
}