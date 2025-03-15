import { useState, useContext, useRef, useEffect } from "react";
import { InvoiceContext } from "./InvoiceContext";
import toast from "react-hot-toast"
import { use } from "react";

// Rastgele 4 rakam üretme fonksiyonu
function generateXMString() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `XM${randomNumber}`;
}

// const newItemObj = {
//   itemName: "",
//   quantitiy: 0,
//   price: 0,
//   total: 0,
// };

export default function NewAndEditInvoice() {
  const { invoiceData, setInvoiceData, isEdit, setEdit, currentInvoice,
    setCurrentInvoice, isModalOpen, setIsModalOpen, isDesktop } = useContext(InvoiceContext);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(isEdit ? currentInvoice.paymentTerms : "Net 30 Days");
  const [items, setItems] = useState([{
    itemName: "",
    quantitiy: 0,
    price: 0,
    total: 0,
  }]);

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
    setItems([...items, {
      itemName: "",
      quantitiy: 0,
      price: 0,
      total: 0,
    }]);
    toast.success("Item added successfully!");
  };

  const handleDeleteItem = (index) => {
    if (items.length !== 1) {
      setItems(items.filter((item, i) => i !== index));
    }
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

  // yeni invoice eklemek için
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const formObj = Object.fromEntries(form);
    console.log("Form Objesi:", formObj);

    const date = new Date(formObj.invoiceDate);
    if (selectedOption === "Net 1 Day") {
      date.setDate(date.getDate() + 1);
    } else if (selectedOption === "Net 7 Days") {
      date.setDate(date.getDate() + 7);
    } else if (selectedOption === "Net 14 Days") {
      date.setDate(date.getDate() + 14);
    } else if (selectedOption === "Net 30 Days") {
      date.setDate(date.getDate() + 30);
    }

    const paymentDue = date.toISOString().split("T")[0];

    let grandTotal = 0;
    items.map((item) => {
      grandTotal += item.total;
    });

    const newInvoiceData = {
      ...formObj,
      id: isEdit ? currentInvoice.id : generateXMString(),
      status: "pending",
      paymentTerms: selectedOption,
      items: [...items],
      paymentDue,
      grandTotal,
    };



    if (isEdit) {
      invoiceData[invoiceData.findIndex((x) => x.id === currentInvoice.id)] = newInvoiceData;
      setInvoiceData([...invoiceData]);
      setEdit(false);
      setCurrentInvoice(null);
      setIsModalOpen(false);
      toast.success("Invoice updated successfully!");
    } else {
      setInvoiceData([...invoiceData, newInvoiceData]);
      setIsModalOpen(false);
      toast.success("Invoice added successfully!");
      e.target.reset();
    }

  };

  useEffect(() => {
    if (isEdit) {
      setItems(structuredClone(currentInvoice.items))
    }
  }, [])

  return (
    <>
      {!isDesktop &&
        <button className="go-back-btn" onClick={() => location.hash = "/"}>
          <img src="/img/back-arrow-icon.svg" alt="Back Arrow Icon" />
          Go back
        </button>
      }

      <div className="form-section">
        {isEdit ? <h2>Edit <span>#</span>{currentInvoice?.id}</h2> : <h2>New Invoice</h2>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="bill-from">
            <h3>Bill From</h3>
            <label>Street Address</label>
            <input type="text" name="billFromstreetAdress" required defaultValue={isEdit ? currentInvoice.billFromstreetAdress : ""} />

            <div className="city-post-country">
              <div className="city">
                <label>City</label>
                <input type="text" name="billFromCity" required defaultValue={isEdit ? currentInvoice.billFromCity : ""} />
              </div>

              <div className="postcode">
                <label>Post Code</label>
                <input type="text" name="billFromPostcode" required defaultValue={isEdit ? currentInvoice.billFromPostcode : ""} />
              </div>

              <div className="country">
                <label>Country</label>
                <input type="text" name="billFromCountry" required defaultValue={isEdit ? currentInvoice.billFromCountry : ""} />
              </div>
            </div>

          </div>

          <div className="bill-to">
            <h3>Bill To</h3>
            <label>Client's Name</label>
            <input type="text" name="clientName" required defaultValue={isEdit ? currentInvoice.clientName : ""} />

            <label>Client's Email</label>
            <input type="email" name="clientEmail" required defaultValue={isEdit ? currentInvoice.clientEmail : ""} />

            <label>Street Address</label>
            <input type="text" name="clientStreet" required defaultValue={isEdit ? currentInvoice.clientStreet : ""} />

            <div className="city-post-country">
              <div className="city">
                <label>City</label>
                <input type="text" name="billToCity" required defaultValue={isEdit ? currentInvoice.billToCity : ""} />
              </div>

              <div className="postcode">
                <label>Post Code</label>
                <input type="text" name="billToPostcode" required defaultValue={isEdit ? currentInvoice.billToPostcode : ""} />
              </div>

              <div className="country">
                <label>Country</label>
                <input type="text" name="billToCountry" required defaultValue={isEdit ? currentInvoice.billToCountry : ""} />
              </div>
            </div>
          </div>

          <div className="date-terms-desc">
            <label>Invoice Date</label>
            <input type="date" name="invoiceDate" required defaultValue={isEdit ? currentInvoice.invoiceDate : ""} />

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
            <input type="text" name="projectDescription" required defaultValue={isEdit ? currentInvoice.projectDescription : ""} />
          </div>

          <div className="item-list">
            <h4>Item List</h4>
            {items.map((item, index) => (
              <div key={index} className="item-info">
                <div className="item-name">
                  <label>Item Name</label>
                  <input type="text"
                    value={item.itemName}
                    onChange={(e) => {
                      items[index].itemName = e.target.value;
                      setItems([...items]);
                    }} required />
                </div>

                <div className="item-qty">
                  <label>Qty.</label>
                  <input type="number"
                    value={item.quantitiy === 0 ? '' : item.quantitiy}
                    onChange={(e) => {
                      items[index].quantitiy = parseInt(e.target.value);
                      handleQtyPriceChange(index);
                    }} required />
                </div>

                <div className="item-price">
                  <label>Price</label>
                  <input type="number" step="0.01"
                    value={item.price === 0 ? '' : item.price}
                    onChange={(e) => {
                      items[index].price = parseFloat(e.target.value);
                      handleQtyPriceChange(index);
                    }} required />
                </div>

                <div className="item-total-price">
                  <label>Total</label>
                  <input type="number" value={item.total} disabled />
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
              <button className="save-changes-btn" type="submit">Save Changes</button>
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