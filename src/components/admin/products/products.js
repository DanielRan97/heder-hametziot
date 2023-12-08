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

const Products = () => {
  const [productPageState, setProductPageState] = useState("");
  const [editProductData, setEditProductData] = useState({});
  const [productsState, setProductsState] = useState([]);
  const [filterProductsState, setFilterProductsState] = useState([]);
  const [productsErrorState, setProductsErrorState] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [loading, setLoading] = useState(true);
  const collator = new Intl.Collator('he', { numeric: true, sensitivity: 'base' });

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

  const sortSelectHandler = (action) => {
    let sortedProducts = [...productsState];

    switch (action) {
      case "מהחדש לישן":
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "מהישן לחדש":
        sortedProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;

      case "מהיקר לזול":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;

      case "מהזול ליקר":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;

      case "א - ת (שם)":
        sortedProducts.sort((a, b) => collator.compare(a.name, b.name));
        break;
        case "ת - א (שם)":
          sortedProducts.sort((a, b) => collator.compare(b.name, a.name));
          break;
      default:
        break;
    }

    setFilterProductsState(sortedProducts);
  };

  const searchHandler = val => {
    val !== "" ?
    setFilterProductsState(filterProductsState.filter(ele => ele.name.includes(val))):
    setFilterProductsState(productsState.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    ))
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

        <select
          defaultValue="מהחדש לישן"
          onChange={(e) => sortSelectHandler(e.target.value)}
        >
          <option value="מהישן לחדש">מהישן לחדש</option>
          <option value="מהחדש לישן">מהחדש לישן</option>
          <option value="מהיקר לזול">מהיקר לזול</option>
          <option value="מהזול ליקר">מהזול ליקר</option>
          <option value="א - ת (שם)">א - ת (שם)</option>
          <option value="ת - א (שם)">ת - א (שם)</option>
        </select>

        <input type="search" placeholder="חפש לפי שם..." onChange={e => searchHandler(e.target.value)}></input>
      </div>
      <ProductsTable
        editPage={(ele) => editProducthandler(ele)}
        productsState={filterProductsState}
        productsErrorState={productsErrorState}
        setProductsErrorState={(ele) =>  setProductsErrorState(ele)}
        setProductsState={(ele) => setFilterProductsState(ele)}
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
