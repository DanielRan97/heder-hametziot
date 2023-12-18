import React, { useEffect, useState } from "react";
import AddProductForm from "./addProductForm/addProductForm";
import AddFormDetails from "./addFormDetails/addFormDetails";
import classes from "./products.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import ProductsTable from "./productsTable/productsTable";
import withClass from "../../../hoc/withClass/withClass";
import EditProductForm from "./editProductForm/editProductForm";
import {  getProducts, getTypes } from "../../../fireBase/fireBaseFuncDb";
import ProductsTableFilters from "./productsTable/productsTableFilters/productsTableFilters";
import DialogComponent from "../../UI/dialogComponent/dialogComponent";

const Products = () => {
  const [productTableShow, setProductTableShow] = useState(true);
  const [productPageState, setProductPageState] = useState("");
  const [editProductData, setEditProductData] = useState({});
  const [productsState, setProductsState] = useState([]);
  const [filterProductsState, setFilterProductsState] = useState([]);
  const [productsErrorState, setProductsErrorState] = useState([]);
  const [productsFilterErrorState, setProductsFilterErrorState] = useState([]);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [categoriesState, setCategoriesState] = useState([]);
  const [typesState, setTypesState] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let products = [];
        let categories = [];
        const res = await getProducts();
        if (res && Object.keys(res).length > 0) {
          for (const [key, value] of Object.entries(res)) {
            products.push({ fbId: key, ...value });
            categories.push(value.categories);
          }
          setCategoriesState(
            [...new Set(categories.map(JSON.stringify))].map(JSON.parse)
          );
          const types = await getTypes();

          const uniqueTypes = types.filter(
            (type, index, self) =>
              index ===
              self.findIndex((t) => JSON.stringify(t) === JSON.stringify(type))
          );

          setTypesState(
            [...new Set(uniqueTypes.map(JSON.stringify))].map(JSON.parse)
          );

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
      <div className={classes.adminActionsDiv}>
        <div>
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
        </div>
        <ProductsTableFilters
          categoriesState={categoriesState}
          typesState={typesState}
          productTableShow={productTableShow}
          productsState={productsState}
          filterProductsState={filterProductsState}
          setFilterProductsState={(ele) => setFilterProductsState(ele)}
          setProductsState={(ele) => setProductsState(ele)}
          productsErrorState={productsErrorState}
          productsFilterErrorState={productsFilterErrorState}
          setProductsErrorState={(ele) => setProductsErrorState(ele)}
          setProductsFilterErrorState={(ele) =>
            setProductsFilterErrorState(ele)
          }
        />
      </div>
      <ProductsTable
        productTableShow={productTableShow}
        setProductTableShow={(bool) => setProductTableShow(bool)}
        editPage={(ele) => editProducthandler(ele)}
        filterProductsState={filterProductsState}
        productsErrorState={productsErrorState}
        productsFilterErrorState={productsFilterErrorState}
        setProductsFilterErrorState={(ele) => setProductsFilterErrorState(ele)}
        setFilterProductsState={(ele) => setFilterProductsState(ele)}
        setProductsErrorState={(ele) => setProductsErrorState(ele)}
        modal={{ ...modal }}
        loading={loading}
        setModal={(modalChild) => setModal(modalChild)}
      />
    </Aux>
  );

  const productsPageHandler = () => {
    switch (productPageState) {
      case "addForm":
        return (
          <DialogComponent closeDialog={() => setProductPageState("")}>
            <AddProductForm />
          </DialogComponent>
        );
      case "addDetailsForm":
        return (
          <DialogComponent closeDialog={() => setProductPageState("")}>
            <AddFormDetails typesState={typesState} />{" "}
          </DialogComponent>
        );
      case "editForm":
        return (
          <DialogComponent closeDialog={() => setProductPageState("")}>
            <EditProductForm setProductPageState={() => setProductPageState("")} editProductData={editProductData} />
          </DialogComponent>
        );
      default:
        break ;
    }
  };

  return (
    <>
      {productsNav()}
      {productsPageHandler()}
    </>
  );
};

export default withClass(Products, classes.Products);
