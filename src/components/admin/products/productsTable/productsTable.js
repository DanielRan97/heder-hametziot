import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Table from "react-bootstrap/Table";
import withClass from "../../../../hoc/withClass/withClass";
import classes from "./productsTable.module.css";
import React, { useState, useEffect } from "react";
import { getProducts, removeProduct } from "../../../../fireBase/fireBaseFunc";
import ModalDialog from "../../../UI/modal/modal";

const ProductsTable = () => {
  const [productsState, setProductsState] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });

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

  const removeP = async (ele) => {
    try {
      await removeProduct(ele);
      const result = productsState.filter(
        (element) => ele !== element.fbId
      );
      setProductsState(result);
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה במחיקת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  const productTableHandler = () => {
    if (productsState.length === 0) {
      return (
        <tr>
          <td colSpan="10">אין מוצרים זמינים</td>
        </tr>
      );
    }
    return productsState.map((ele) => (
      <tr key={ele.id}>
        <td>{ele.id}</td>
        <td>{ele.name}</td>
        <td>{ele.description}</td>
        <td>₪{ele.price}</td>
        <td>{ele.categories}</td>
        <td>{ele.types}</td>
        <td>{ele.gender}</td>
        <td>
          <a href={ele.link} target="_blank" rel="noopener noreferrer">
            {ele.link}
          </a>
        </td>
        <td>
          <img
            className={classes.productImg}
            src={ele.photos[0]}
            alt="תמונה ראשית"
          />
        </td>
        <td>
          <button
            type="button"
            className={classes.deleteProductButton}
            onClick={() => removeP(ele.fbId)}
          >
            מחיקה
          </button>
        </td>
      </tr>
    ));
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
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>id</th>
            <th>שם</th>
            <th>תיאור</th>
            <th>מחיר</th>
            <th>קטגוריה</th>
            <th>תת קטגוריה</th>
            <th>מיגדר</th>
            <th>קישור</th>
            <th>תמונה ראשית</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody>{productTableHandler()}</tbody>
      </Table>
    </Aux>
  );
};

export default withClass(ProductsTable, classes.ProductsTable);
