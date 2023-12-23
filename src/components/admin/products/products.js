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
import {
  getProducts,
  getTypes,
  getVisits,
} from "../../../fireBase/fireBaseFuncDb";
import ProductsTableFilters from "./productsTable/productsTableFilters/productsTableFilters";
import DialogComponent from "../../UI/dialogComponent/dialogComponent";
import Loading from "../../UI/loading/loading";

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
  const [visits, setVisits] = useState([]);
  const [allProductsWatches, setAllProductsWatches] = useState(0);
  const [allProductsClicks, setAllProductsClicks] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let products = [];
        let categories = [];
        let watches = 0;
        let clicks = 0;

        const res = await getProducts();

        if (res && Object.keys(res).length > 0) {
          for (const [key, value] of Object.entries(res)) {
            products.push({ fbId: key, ...value });
            categories.push(value.categories);
            value.watches > 0 ? watches = watches +  value.watches : watches = watches + 0
            value.clicks > 0 ? clicks = clicks +  value.clicks : clicks = clicks + 0
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

          setAllProductsWatches(watches);
          setAllProductsClicks(clicks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setModal({
          show: true,
          title: "שגיאה",
          text: "שגיאה בקריאת נתונים, בדוק את חיבור האינטרנט",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visits = await getVisits();
        if (visits !== null) {
          const visitsArray = Object.values(visits);
          setVisits(visitsArray);
        } else {
          setVisits([]);
        }
      } catch (error) {
        setModal({
          show: true,
          title: "שגיאה",
          text: "שגיאה בקריאת נתונים, בדוק את חיבור האינטרנט",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <EditProductForm
              setProductPageState={() => setProductPageState("")}
              editProductData={editProductData}
            />
          </DialogComponent>
        );
      default:
        break;
    }
  };

  return (
    <Aux>
      <div className={classes.siteDataDiv}>
        {loading ? (
          <Loading />
        ) : (
          <details>
            <summary>נתונים</summary>
            <p>סה"כ כניסות לאתר: {visits.length > 0 ? visits.length : 0}</p>
            <p>סה"כ צפיות במוצרים:{allProductsWatches > 0 ? allProductsWatches : 0}</p>
            <p>סה"כ לחיצות לקנייה :{allProductsClicks > 0 ? allProductsClicks : 0}</p>
          </details>
        )}
      </div>
      {productsNav()}
      {productsPageHandler()}
    </Aux>
  );
};

export default withClass(Products, classes.Products);
