import React, { useState } from "react";
import Aux from "../../../../../hoc/Auxiliary/Auxiliary";
import classes from './productsTableFilters.module.css';

const ProductsTableFilters = (props) => {
  const collator = new Intl.Collator("he", {
    numeric: true,
    sensitivity: "base",
  });

  const [filterCategory, setFilterCategory] = useState("הצג את כל הקטגוריות");
  const [filterType, setFilterType] = useState("הצג את כל התת קטגוריות");
  const [filterGender, setFilterGender] = useState("הצג את כל המגדרים");
  const [searchProductVal, setSearchProductVal] = useState("");

  const sortProducts = (products, order) => {
    return [...products].sort((a, b) => {
      switch (order) {
        case "מהחדש לישן":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "מהישן לחדש":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "מהיקר לזול":
          return b.price - a.price;
        case "מהזול ליקר":
          return a.price - b.price;
        case "צפיות (נמוך לגבוהה)":
          return a.watches - b.watches;
        case "צפיות (גבוהה לנמוך)":
          return b.watches - a.watches;
        case "לחיצות לקנייה (נמוך לגבוהה)":
          return a.clicks - b.clicks;
        case "לחיצות לקנייה (גבוהה לנמוך)":
          return b.clicks - a.clicks;
        case "א - ת (שם)":
          return collator.compare(a.name, b.name);
        case "ת - א (שם)":
          return collator.compare(b.name, a.name);
        default:
          return 0;
      }
    });
  };

  const sortSelectHandler = (action) => {
    const sortedProducts = sortProducts(props.productsState, action);
    const sortedErrorProducts = sortProducts(props.productsErrorState, action);
    props.setProductsState(sortedProducts);
    props.setProductsErrorState(sortedErrorProducts);

    if (props.productTableShow) {
      const sortedFilterProducts = sortProducts(
        props.filterProductsState,
        action
      );
      const sortedFilterErrorProducts = sortProducts(
        props.productsFilterErrorState,
        action
      );
      props.setFilterProductsState(sortedFilterProducts);
      props.setProductsFilterErrorState(sortedFilterErrorProducts);
    }
  };

  const categoryFilterHandler = (category) => {
    setFilterCategory(category);
    setSearchProductVal("");

    if (category === "הצג את כל הקטגוריות") {
      filterGender === "הצג את כל המגדרים"
        ? props.setFilterProductsState([...props.productsState])
        : props.setFilterProductsState([
            ...props.productsState.filter((ele) => ele.gender === filterGender),
          ]);
    } else {
      const filteredProducts =
        filterGender === "הצג את כל המגדרים"
          ? props.productsState.filter((ele) => ele.categories === category)
          : props.productsState.filter(
              (ele) =>
                ele.categories === category && ele.gender === filterGender
            );
      props.setFilterProductsState([...filteredProducts]);
    }
  };

  const typeFilterHandler = (type) => {
    setFilterType(type);
    setSearchProductVal("");

    if (type === "הצג את כל התת קטגוריות") {
      const filteredProducts =
        filterGender === "הצג את כל המגדרים"
          ? props.productsState.filter(
              (ele) => ele.categories === filterCategory
            )
          : props.productsState.filter(
              (ele) =>
                ele.categories === filterCategory && ele.gender === filterGender
            );
      props.setFilterProductsState([...filteredProducts]);
    } else {
      const filteredProducts =
        filterGender === "הצג את כל המגדרים"
          ? props.productsState.filter(
              (ele) => ele.types === type && ele.categories === filterCategory
            )
          : props.productsState.filter(
              (ele) =>
                ele.types === type &&
                ele.categories === filterCategory &&
                ele.gender === filterGender
            );
      props.setFilterProductsState([...filteredProducts]);
    }
  };

  const genderFilter = (gender) => {
    setFilterGender(gender);
    setSearchProductVal("");
    if (gender === "הצג את כל המגדרים") {
      setFilterType("");
      const filteredProducts =
        filterCategory !== "הצג את כל הקטגוריות"
          ? props.productsState.filter(
              (ele) => ele.categories === filterCategory
            )
          : props.productsState;

      props.setFilterProductsState([...filteredProducts]);
    } else {
      const filteredProducts =
        filterCategory !== "הצג את כל הקטגוריות"
          ? props.productsState.filter((ele) =>
              filterType === "הצג את כל התת קטגוריות"
                ? ele.categories === filterCategory && ele.gender === gender
                : ele.gender === gender &&
                  ele.categories === filterCategory &&
                  ele.types === filterType &&
                  ele.categories === filterCategory
            )
          : props.productsState.filter((ele) => ele.gender === gender);

      props.setFilterProductsState([...filteredProducts]);
    }
  };

  const searchHandler = (name) => {
    setFilterCategory("הצג את כל הקטגוריות");
    setFilterType("הצג את כל התת קטגוריות");
    setFilterGender("הצג את כל המגדרים");
    setSearchProductVal(name);
    if (!props.productTableShow) {
      const filteredErrorProducts =
        name.length > 0
          ? props.productsErrorState.filter((ele) => ele.name.includes(name))
          : props.productsErrorState;

      props.setProductsFilterErrorState([...filteredErrorProducts]);
    } else {
      const filterProducts =
        name.length > 0
          ? props.productsState.filter((ele) => ele.name.includes(name))
          : props.productsState;

      props.setFilterProductsState([...filterProducts]);
    }
  };

  return (
    <Aux>
      <select
        defaultValue="מהחדש לישן"
        onChange={(e) => sortSelectHandler(e.target.value)}
      >
        <option value="מהישן לחדש">מהישן לחדש</option>
        <option value="מהחדש לישן">מהחדש לישן</option>
        <option value="מהיקר לזול">מהיקר לזול</option>
        <option value="מהזול ליקר">מהזול ליקר</option>
        <option value="צפיות (נמוך לגבוהה)">צפיות (נמוך לגבוהה)</option>
        <option value="צפיות (גבוהה לנמוך)">צפיות (גבוהה לנמוך)</option>
        <option value="לחיצות לקנייה (נמוך לגבוהה)">
          לחיצות לקנייה (נמוך לגבוהה)
        </option>
        <option value="לחיצות לקנייה (גבוהה לנמוך)">
          לחיצות לקנייה (גבוהה לנמוך)
        </option>
        <option value="א - ת (שם)">א - ת (שם)</option>
        <option value="ת - א (שם)">ת - א (שם)</option>
      </select>

      {props.productTableShow && (
        <select
          value={filterCategory}
          onChange={(e) => categoryFilterHandler(e.target.value)}
        >
          <option value="הצג את כל הקטגוריות">הצג את כל הקטגוריות</option>
          {props.categoriesState &&
            props.categoriesState.map((ele, index) => (
              <option value={ele} key={index}>
                {ele}
              </option>
            ))}
        </select>
      )}

      {filterCategory !== "הצג את כל הקטגוריות" && props.productTableShow && (
        <select
          value={filterType}
          onChange={(e) => typeFilterHandler(e.target.value)}
        >
          <option value="הצג את כל התת קטגוריות">הצג את כל התת קטגוריות</option>
          {props.categoriesState &&
            props.typesState.map(
              (ele, index) =>
                filterCategory === ele.category && (
                  <option value={ele.type} key={index}>
                    {ele.type}
                  </option>
                )
            )}
        </select>
      )}
      {props.productTableShow && (
        <select
          value={filterGender}
          onChange={(e) => genderFilter(e.target.value)}
        >
          <option value="הצג את כל המגדרים"> הצג את כל המגדרים</option>
          <option value="שניהם">יוניסקס</option>
          <option value="זכר">גברים</option>
          <option value="נקבה">נשים</option>
        </select>
      )}
      <input
        className={classes.inputSearch}
        type="text"
        placeholder="חפש לפי שם..."
        value={searchProductVal}
        onChange={(e) => searchHandler(e.target.value)}
      ></input>
    </Aux>
  );
};

export default ProductsTableFilters;
