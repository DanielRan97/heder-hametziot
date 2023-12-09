import React, { useEffect, useState } from "react";
import AddProductForm from "./addProductForm/addProductForm";
import AddFormDetails from "./addFormDetails/addFormDetails";
import classes from "./products.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import ProductsTable from "./productsTable/productsTable";
import withClass from "../../../hoc/withClass/withClass";
import EditProductForm from "./editProductForm/editProductForm";
import { getProducts } from "../../../fireBase/fireBaseFunc";
import ProductsTableFilters from "./productsTable/productsTableFilters/productsTableFilters";

const Products = () => {
  const [productPageState, setProductPageState] = useState("");
  const [editProductData, setEditProductData] = useState({});
  const [productsState, setProductsState] = useState([]);
  const [filterProductsState, setFilterProductsState] = useState([]);
  const [productsErrorState, setProductsErrorState] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [loading, setLoading] = useState(true);

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
          setFilterProductsState(
            products.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          );
          setLoading(false);
        }
      } catch (error) {
        setModal({
          show: true,
          title: "שגיאה",
          text: "שגיאה בקריאת נתונים, בדוק את חיבור האינטרנט",
        });
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const editProducthandler = (ele) => {
    setEditProductData({});
    setProductPageState("editForm");
    setEditProductData(ele);
  };

  const productsNav = () => (
    <Aux>
      <h1>ניהול מוצרים </h1>

      <div className={classes.adminActionsDiv}>
        <button
          className={classes.productsNavButtons}
          type="button"
          onClick={() => setProductPageState("addForm")}
        >
          הוסף מוצר
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          className={classes.productsNavButtons}
          type="button"
          onClick={() => setProductPageState("addDetailsForm")}
        >
          הוסף קטגוריה/תת קטגוריה
          <FontAwesomeIcon icon={faPlus} />
        </button>

        <ProductsTableFilters
          productsState={productsState}
          filterProductsState={filterProductsState}
          setFilterProductsState={(ele) => setFilterProductsState(ele)}
          setProductsState={(ele) => setProductsState(ele)}
        />
      </div>
      <ProductsTable
        editPage={(ele) => editProducthandler(ele)}
        filterProductsState={filterProductsState}
        productsErrorState={productsErrorState}
        setProductsErrorState={(ele) => setProductsErrorState(ele)}
        setFilterProductsState={(ele) => setFilterProductsState(ele)}
        modal={{ ...modal }}
        loading={loading}
        setModal={(modalChild) => setModal(modalChild)}
      />
    </Aux>
  );

  const productsPageHandler = () => {
    switch (productPageState) {
      case "":
        return productsNav();
      case "addForm":
        return <AddProductForm />;
      case "addDetailsForm":
        return <AddFormDetails />;
      case "editForm":
        return (
          <EditProductForm
            backToTable={() => setProductPageState("")}
            editProductData={editProductData}
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
