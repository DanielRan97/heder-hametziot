import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Table from "react-bootstrap/Table";
import withClass from "../../../../hoc/withClass/withClass";
import classes from "./productsTable.module.css";
import React, { useState, useEffect } from "react";
import { getProducts, removeProduct } from "../../../../fireBase/fireBaseFunc";
import ModalDialog from "../../../UI/modal/modal";

const ProductsTable = () => {
  const [productsState, setProductsState] = useState([]);
  const [productsErrorState, setProductsErrorState] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [productTableShow, setProductTableShow] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let products = [];
        const res = await getProducts();
        if (res && Object.keys(res).length > 0) {
          for (const [key, value] of Object.entries(res)) {
            products.push({ fbId: key, ...value });
          }
          setProductsState(products);
        }
      } catch (error) {
        setModal({
          show: true,
          title: "שגיאה",
          text: "שגיאה בקריאת נתונים, בדוק את חיבור האינטרנט",
        });
      }
    };

    fetchProducts();
  }, []);

  const removeP = async (ele, error) => {
    try {
      productsErrorState.length === 1 && setProductTableShow(true);
      await removeProduct(ele);
      if (error === false) {
        const result = productsState.filter((element) => ele !== element.fbId);
        setProductsState(result.reverse());
      } else {
        const resultError = productsErrorState.filter(
          (element) => ele !== element.fbId
        );
        setProductsErrorState(resultError.reverse());
      }
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה במחיקת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  const handleImageError = (element) => {
    let filter = productsState.filter((ele) => ele !== element);
    setProductsState(filter);
    setProductsErrorState([...productsErrorState, element]);
  };

  const productTableHandler = () => {
    if (productsState.length === 0) {
      return (
        <tr>
          <td colSpan="10">אין מוצרים זמינים</td>
        </tr>
      );
    }

    return productsState.reverse().map((ele, index) => (
      <tr key={ele.id}>
        <td>{index + 1}</td>
        <td>{ele.name}</td>
        <td>{ele.description}</td>
        <td>₪{ele.price}</td>
        <td>{ele.categories}</td>
        <td>{ele.types}</td>
        <td>{ele.gender}</td>
        <td>{`${new Date(ele.createdAt).getDay().toLocaleString()}/${new Date(
          ele.createdAt
        )
          .getMonth()
          .toLocaleString()}/${new Date(ele.createdAt)
          .getFullYear()
          .toLocaleString()}`}</td>
        <td>
          <a href={ele.link} target="_blank" rel="noreferrer noopener">
            {ele.link}
          </a>
        </td>
        <td>
          <img
            className={classes.productImg}
            src={ele.photos[0]}
            alt="תמונה ראשית"
            onError={() => handleImageError(ele)}
          />
        </td>
        <td>
          <button
            type="button"
            className={classes.deleteProductButton}
            onClick={() => removeP(ele.fbId, false)}
          >
            מחיקה
          </button>
        </td>
      </tr>
    ));
  };

  const productTableErrorHandler = () => {
    if (productsErrorState.length === 0) {
      return (
        <tr>
          <td colSpan="10">אין מוצרים זמינים</td>
        </tr>
      );
    }
    return productsErrorState.reverse().map((ele, index) => (
      <tr key={ele.id}>
        <td>{index}</td>
        <td>{ele.name}</td>
        <td>{ele.description}</td>
        <td>₪{ele.price}</td>
        <td>{ele.categories}</td>
        <td>{ele.types}</td>
        <td>{ele.gender}</td>
        <td>{`${new Date(ele.createdAt).getDay().toLocaleString()}/${new Date(
          ele.createdAt
        )
          .getMonth()
          .toLocaleString()}/${new Date(ele.createdAt)
          .getFullYear()
          .toLocaleString()}`}</td>
        <td>
          <a href={ele.link} target="_blank" rel="noopener noreferrer">
            {ele.link}
          </a>
        </td>
        <td></td>
        <td>
          <button
            type="button"
            className={classes.deleteProductButton}
            onClick={() => removeP(ele.fbId, true)}
          >
            מחיקה
          </button>
        </td>
      </tr>
    ));
  };

  const renderTable = () => {
    return (
      <Aux>
        <thead>
          <tr>
            <th>id</th>
            <th>שם</th>
            <th>תיאור</th>
            <th>מחיר</th>
            <th>קטגוריה</th>
            <th>תת קטגוריה</th>
            <th>מיגדר</th>
            <th>תאריך יצירה</th>
            <th>קישור</th>
            <th>תמונה ראשית</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody className={classes.tbody}>{productTableHandler()}</tbody>
      </Aux>
    );
  };

  const renderErrorTable = () => {
    return (
      <Aux>
        <thead>
          <tr>
            <th>id</th>
            <th>שם</th>
            <th>תיאור</th>
            <th>מחיר</th>
            <th>קטגוריה</th>
            <th>תת קטגוריה</th>
            <th>מיגדר</th>
            <th>תאריך יצירה</th>
            <th>קישור</th>
            <th>תמונה ראשית</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody className={classes.tbody}>{productTableErrorHandler()}</tbody>
      </Aux>
    );
  };

  const tableRadioRender = () => {
    return (
      <form className={classes.tableRadioInput}>
        <label>
          ({productsErrorState.length}) מוצרים לא תקינים
          <input
            name="products"
            value={productTableShow}
            onChange={() => setProductTableShow(false)}
            type="radio"
          />
        </label>
        <label>
          ({productsState.length}) <span>מוצרים תקינים</span>
          <input
            name="products"
            value={productTableShow}
            defaultChecked={true}
            onChange={() => setProductTableShow(true)}
            type="radio"
          />
        </label>
      </form>
    );
  };

  return (
    <Aux>
      {modal.show ? (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      ) : null}
      {productsErrorState.length > 0 && tableRadioRender()}
      <Table striped bordered hover responsive>
        {productTableShow ? renderTable() : renderErrorTable()}
      </Table>
    </Aux>
  );
};

export default withClass(ProductsTable, classes.ProductsTable);
