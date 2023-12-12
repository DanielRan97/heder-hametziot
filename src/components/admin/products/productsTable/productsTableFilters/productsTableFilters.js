import { useState } from "react";
import Aux from "../../../../../hoc/Auxiliary/Auxiliary";

const ProductsTableFilters = (props) => {
  const collator = new Intl.Collator("he", {
    numeric: true,
    sensitivity: "base",
  });
  const [filterCategory, setFilterCategory] = useState("הצג את כל הקטגוריות");
  const [filterType, setFilterType] = useState("הצג את כל התת קטגוריות");
  const [searchProductVal, setSearchProductVal] = useState("");
  const sortSelectHandler = (action) => {
    let sortedFilterProducts = [...props.filterProductsState];
    let sortedProducts = [...props.productsState];
    let sortedFilterErrorProducts = [...props.productsFilterErrorState];
    let sortedErrorProducts = [...props.productsErrorState];

    switch (action) {
      case "מהחדש לישן":
        sortedFilterProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        sortedFilterErrorProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        sortedErrorProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "מהישן לחדש":
        sortedFilterProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        sortedProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        sortedFilterErrorProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        sortedErrorProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;

      case "מהיקר לזול":
        sortedFilterProducts.sort((a, b) => b.price - a.price);
        sortedProducts.sort((a, b) => b.price - a.price);
        sortedFilterErrorProducts.sort((a, b) => b.price - a.price);
        sortedErrorProducts.sort((a, b) => b.price - a.price);
        break;

      case "מהזול ליקר":
        sortedFilterProducts.sort((a, b) => a.price - b.price);
        sortedProducts.sort((a, b) => a.price - b.price);
        sortedFilterErrorProducts.sort((a, b) => a.price - b.price);
        sortedErrorProducts.sort((a, b) => a.price - b.price);
        break;

      case "א - ת (שם)":
        sortedFilterProducts.sort((a, b) => collator.compare(a.name, b.name));
        sortedProducts.sort((a, b) => collator.compare(a.name, b.name));
        sortedFilterErrorProducts.sort((a, b) =>
          collator.compare(a.name, b.name)
        );
        sortedErrorProducts.sort((a, b) => collator.compare(a.name, b.name));
        break;

      case "ת - א (שם)":
        sortedFilterProducts.sort((a, b) => collator.compare(b.name, a.name));
        sortedProducts.sort((a, b) => collator.compare(b.name, a.name));
        sortedFilterErrorProducts.sort((a, b) =>
          collator.compare(b.name, a.name)
        );
        sortedErrorProducts.sort((a, b) => collator.compare(b.name, a.name));
        break;

      default:
        break;
    }

    props.setFilterProductsState(sortedFilterProducts);
    props.setProductsState(sortedProducts);
    props.setProductsFilterErrorState(sortedFilterErrorProducts);
    props.setProductsErrorState(sortedErrorProducts);
  };

  const categoryFilterHandler = (category) => {
    setFilterCategory(category);
    setSearchProductVal("");
    let filter = [...props.productsState];

    category !== "הצג את כל הקטגוריות"
      ? props.setFilterProductsState([
          ...filter.filter((ele) => ele.categories === category),
        ])
      : props.setFilterProductsState([...filter]);
  };

  const typeFilterHandler = (type) => {
    setFilterType(type);
    setSearchProductVal("");
    let filter = [...props.productsState];

    type !== "הצג את כל התת הקטגוריות"
      ? props.setFilterProductsState([
          ...filter.filter((ele) => ele.types === type && ele.categories === filterCategory),
        ])
      : props.setFilterProductsState([...filter.filter((ele) => ele.categories === filterCategory)]);
  };

  const searchHandler = (name) => {
    setSearchProductVal(name);
    if (props.productTableShow === false) {
      let filterError = [...props.productsErrorState];
      name.length > 0
        ? props.setProductsFilterErrorState([
            ...filterError.filter((ele) => ele.name.includes(name)),
          ])
        : props.setProductsFilterErrorState([...filterError]);
    } else {
      let filter =
        filterCategory === "הצג את כל הקטגוריות"
          ? [...props.productsState]
          : [
              ...props.productsState.filter(
                (ele) => ele.categories === filterCategory
              ),
            ];
      name.length > 0
        ? props.setFilterProductsState(
            filterCategory === "הצג את כל הקטגוריות"
              ? [...filter.filter((ele) => ele.name.includes(name))]
              : [...filter.filter((ele) => ele.name.includes(name))]
          )
        : props.setFilterProductsState(
            filterCategory === "הצג את כל הקטגוריות"
              ? [...filter]
              : [...filter.filter((ele) => ele.categories === filterCategory)]
          );
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
        <option value="א - ת (שם)">א - ת (שם)</option>
        <option value="ת - א (שם)">ת - א (שם)</option>
      </select>

      {props.productTableShow === true &&
      <select
        value={filterCategory}
        onChange={(e) => categoryFilterHandler(e.target.value)}
      >
        <option value="הצג את כל הקטגוריות">הצג את כל הקטגוריות</option>
        {props.productTableShow === true &&
          props.categoriesState &&
          props.categoriesState.map((ele, index) => (
            <option value={ele} key={index}>
              {ele}
            </option>
          ))}
      </select>}

      {filterCategory !== "הצג את כל הקטגוריות" && (
        <select
          value={filterType}
          onChange={(e) => typeFilterHandler(e.target.value)}
        >
          <option value="הצג את כל התת הקטגוריות">
            הצג את כל התת הקטגוריות
          </option>
          {props.productTableShow === true &&
            props.categoriesState &&
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

      <input
        type="search"
        placeholder="חפש לפי שם..."
        value={searchProductVal}
        onChange={(e) => searchHandler(e.target.value)}
      ></input>
    </Aux>
  );
};

export default ProductsTableFilters;
