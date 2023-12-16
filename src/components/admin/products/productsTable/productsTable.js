import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Table from "react-bootstrap/Table";
import withClass from "../../../../hoc/withClass/withClass";
import classes from "./productsTable.module.css";
import React, { useState } from "react";
import {
  removeProduct
} from "../../../../fireBase/fireBaseFuncDb";
import ModalDialog from "../../../UI/modal/modal";
import { useNavigate } from "react-router-dom";
import ProductTableBody from "./productTableBody/productTableBody";
import ProductTableBodyError from "./productTableBody/productTableBodyError";

const ProductsTable = (props) => {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteDialogHandler = (id) => {
    setDeleteDialog(id);
  };

  const cancelDeleteDialogHandler = async() => {
    setDeleteDialog("");
  };

  const removeP = async (ele, photoId, worked) => {
    setDeleteLoading(true);

    try {
      if (props.productsFilterErrorState.length === 1) {
        props.setProductTableShow(true);
      }
      await removeProduct(ele, photoId);
      if (worked === false) {
        const result = props.filterProductsState.filter(
          (element) => ele !== element.fbId
        );
        props.setFilterProductsState(result);
        const resultError = props.productsFilterErrorState.filter(
          (element) => ele !== element.fbId
        );
        props.setProductsFilterErrorState(resultError);
      }
      setDeleteLoading(false);
    } catch (error) {
      setDeleteLoading(false);
      props.setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה במחיקת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  const handleImageError = (element) => {
    let filter = props.filterProductsState.filter((ele) => ele !== element);
    props.setFilterProductsState(filter);
    props.setProductsFilterErrorState([
      ...props.productsFilterErrorState,
      element,
    ]);
    props.setProductsErrorState([...props.productsFilterErrorState, element]);
  };

  const showProduct = (ele) => {
    navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`);
  };

  const productTableBodyHandler = () => {
    return (
      <ProductTableBody

        filterProductsState={props.filterProductsState}
        loading={props.loading}
        deleteDialog={deleteDialog}
        deleteLoading={deleteLoading}
        deleteDialogHandler={(id) => deleteDialogHandler(id)}
        showProduct={(ele) => showProduct(ele)}
        editPage={(ele) => props.editPage(ele)}
        removeP={(fbId, id, bool) => removeP(fbId, id, bool)}
        cancelDeleteDialogHandler={() => cancelDeleteDialogHandler()}
        handleImageError={(ele) => handleImageError(ele)}
      />
    );
  };

  const productTableBodyErrorHandler = () => {
    return (
      <ProductTableBodyError

        productsFilterErrorState={props.productsFilterErrorState}
        loading={props.loading}
        deleteDialog={deleteDialog}
        deleteLoading={deleteLoading}
        deleteDialogHandler={(id) => deleteDialogHandler(id)}
        showProduct={(ele) => showProduct(ele)}
        editPage={(ele) => props.editPage(ele)}
        removeP={(fbId, id, bool) => removeP(fbId, id, bool)}
        cancelDeleteDialogHandler={() => cancelDeleteDialogHandler()}
      />
    );
  };

  const renderTableHeader = () => {
    return (
      <Aux>
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
          <th>צפיות במוצר</th>
          <th>לחיצות לקנייה</th>
          <th>הצג מוצר</th>
          <th>הצג באלי אקספרס</th>
          <th>עריכה</th>
          <th>מחיקה</th>
        </tr>
      </Aux>
    );
  };

  const tableRadioRender = () => {
    return (
      <form className={classes.tableRadioInput}>
        <label>
          ({props.productsFilterErrorState.length}) מוצרים לא תקינים
          <input
            name="products"
            value={props.productTableShow}
            onChange={() => props.setProductTableShow(false)}
            type="radio"
          />
        </label>
        <label>
          ({props.filterProductsState.length}) <span>מוצרים תקינים</span>
          <input
            name="products"
            value={props.productTableShow}
            defaultChecked={true}
            onChange={() => props.setProductTableShow(true)}
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
          onModalClose={() =>
            props.setModal({ show: false, title: "", text: "" })
          }
        />
      ) : null}
      {props.productsFilterErrorState.length > 0 && tableRadioRender()}
      {`${props.filterProductsState.length}מוצרים`}
      <Table striped bordered hover responsive>
        <thead>{renderTableHeader()}</thead>
        <tbody>
          {props.productTableShow
            ? productTableBodyHandler()
            : productTableBodyErrorHandler()}
        </tbody>
      </Table>
    </Aux>
  );
};

export default withClass(ProductsTable, classes.ProductsTable);
