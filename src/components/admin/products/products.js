import React, { useState } from "react";
import AddProductForm from "./addProductForm/addProductForm";
import AddFormDetails from "./addFormDetails/addFormDetails";
import classes from "./products.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import ProductsTable from "./productsTable/productsTable";
import withClass from '../../../hoc/withClass/withClass';
import EditProductForm from "./editProductForm/editProductForm";

const Products = () => {
  const [productPageState, setProductPageState] = useState("");
  const [editProductData, setEditProductData] = useState({});

  const editProducthandler = (ele) => {
    setEditProductData({});
    setProductPageState('editForm');
    setEditProductData(ele)
  }


  const productsNav = () => (
    <Aux>
      <h1>ניהול מוצרים </h1>
      <button
        className={classes.productsNavButtons}
        type="button"
        onClick={() => setProductPageState("addForm")}
        key="addFormButton"
      >
        הוסף מוצר
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button
      className={classes.productsNavButtons}
        type="button"
        onClick={() => setProductPageState("addDetailsForm")}
        key="addDetailsFormButton"
      >
        הוסף קטגוריה/תת קטגוריה
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <ProductsTable editPage={(ele) => editProducthandler(ele)}/>
    </Aux>
  );

  const productsPageHandler = () => {
    switch (productPageState) {
      case "":
        return productsNav();
      case "addForm":
        return (
          <AddProductForm />
        );
      case "addDetailsForm":
        return (
          <AddFormDetails />
        );
        case "editForm":
          return (
            <EditProductForm backToTable={() => setProductPageState('')} editProductData={editProductData}
            />
          );
      default:
        return productsNav();
    }
  };

  return (
    <>
      {productPageState !== "" ? (
        <FontAwesomeIcon
          icon={faArrowRight}
          className={classes.productsNavButtons}
          onClick={() => setProductPageState("")}
        />
      ) : null}
      {productsPageHandler()}
    </>
  );
};

export default withClass(Products, classes.Products);
