import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Table from "react-bootstrap/Table";
import withClass from "../../../../hoc/withClass/withClass";
import classes from "./productsTable.module.css";
import React, { useState } from "react";
import {removeProduct } from "../../../../fireBase/fireBaseFunc";
import ModalDialog from "../../../UI/modal/modal";
import { useNavigate } from "react-router-dom";
import Loading from '../../../UI/loading/loading';

const ProductsTable = (props) => {
  const [productTableShow, setProductTableShow] = useState(true);
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState("");

  const deleteDialogHandler = (id) => {
    setDeleteDialog(id);
    props.setProductsState(props.productsState);
  };

  const cancelDeleteDialogHandler = () => {
    setDeleteDialog("");
  };

  const removeP = async (ele, error) => {
    try {
      props.productsErrorState.length === 1 && setProductTableShow(true);
      await removeProduct(ele);
      if (error === false) {
        const result = props.productsState.filter((element) => ele !== element.fbId);
        props.setProductsState(result);
      } else {
        const resultError = props.productsErrorState.filter(
          (element) => ele !== element.fbId
        );
        props.setProductsErrorState(resultError);
      }
    } catch (error) {
      props.setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה במחיקת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  const handleImageError = (element) => {
    let filter = props.productsState.filter((ele) => ele !== element);
    props.setProductsState(filter);
    props.setProductsErrorState([...props.productsErrorState, element]);
  };

  const showProduct = (ele) => {
    navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`);
  };

  const productTableHandler = () => {

    if(props.loading){
      return (
        <tr>
        <td colSpan="13"><Loading /></td>
      </tr>
      );
    }
    if (props.productsState.length === 0) {
      return (
        <tr>
          <td colSpan="13">אין מוצרים זמינים</td>
        </tr>
      );
    }

    return props.productsState.map((ele, index) => (
      <tr key={ele.id}>
        <td>{index + 1}</td>
        <td>{ele.name}</td>
        <td>{ele.description}</td>
        <td>₪{ele.price}.00</td>
        <td>{ele.categories}</td>
        <td>{ele.types}</td>
        <td>{ele.gender}</td>
        <td>{`${new Date(ele.createdAt).getDate().toLocaleString()}/${
          new Date(ele.createdAt).getMonth() + 1
        }/${new Date(ele.createdAt).getFullYear().toLocaleString()}`}</td>
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
            className={classes.showProduct}
            onClick={() => showProduct(ele)}
          >
            הצג מוצר
          </button>
        </td>
        <td>
          <button
            type="button"
            className={classes.editProductButton}
            onClick={() => props.editPage(ele)}
          >
            עריכה
          </button>
        </td>
        <td>
          {deleteDialog !== ele.fbId ? (
            <button
              type="button"
              className={classes.deleteProductButton}
              onClick={() => deleteDialogHandler(ele.fbId)}
            >
              מחיקה
            </button>
          ) : (
            <div>
              <button
                className={classes.deleteDialogProductButton}
                onClick={() => removeP(ele.fbId)}
              >
                מחיקה
              </button>
              <button
                className={classes.deleteDialogCancelProductButton}
                onClick={() => cancelDeleteDialogHandler()}
              >
                ביטול
              </button>
            </div>
          )}
        </td>
      </tr>
    ));
  };

  const productTableErrorHandler = () => {
    if (props.productsErrorState.length === 0 && !props.loading) {
      return (
        <tr>
          <td colSpan="10">אין מוצרים זמינים</td>
        </tr>
      );
    }
    return props.productsErrorState.map((ele, index) => (
      <tr key={ele.id}>
        <td>{index}</td>
        <td>{ele.name}</td>
        <td>{ele.description}</td>
        <td>₪{ele.price}.00</td>
        <td>{ele.categories}</td>
        <td>{ele.types}</td>
        <td>{ele.gender}</td>
        <td>{`${new Date(ele.createdAt).getDate().toLocaleString()}/${
          new Date(ele.createdAt).getMonth() + 1
        }/${new Date(ele.createdAt).getFullYear().toLocaleString()}`}</td>
        <td>
          <a href={ele.link} target="_blank" rel="noopener noreferrer">
            {ele.link}
          </a>
        </td>
        <td></td>
        <td>
          <button
            type="button"
            className={classes.editProductButton}
            onClick={() => props.editPage(ele)}
          >
            עריכה
          </button>
        </td>
        <td>
          {deleteDialog !== ele.fbId ? (
            <button
              type="button"
              className={classes.deleteProductButton}
              onClick={() => deleteDialogHandler(ele.fbId)}
            >
              מחיקה
            </button>
          ) : (
            <div>
              <button
                className={classes.deleteDialogProductButton}
                onClick={() => removeP(ele.fbId)}
              >
                מחיקה
              </button>
              <button
                className={classes.deleteDialogCancelProductButton}
                onClick={() => cancelDeleteDialogHandler()}
              >
                ביטול
              </button>
            </div>
          )}
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
            <th>הצג מוצר</th>
            <th>עריכה</th>
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
            <th>עריכה</th>
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
          ({props.productsErrorState.length}) מוצרים לא תקינים
          <input
            name="products"
            value={productTableShow}
            onChange={() => setProductTableShow(false)}
            type="radio"
          />
        </label>
        <label>
          ({props.productsState.length}) <span>מוצרים תקינים</span>
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
      {props.modal.show ? (
        <ModalDialog
          title={props.modal.title}
          text={props.modal.text}
          onModalClose={() => props.setModal({ show: false, title: "", text: "" })}
        />
      ) : null}
      {props.productsErrorState.length > 0 && tableRadioRender()}
      <Table striped bordered hover responsive>
        {productTableShow ? renderTable() : renderErrorTable()}
      </Table>
    </Aux>
  );
};

export default withClass(ProductsTable, classes.ProductsTable);
