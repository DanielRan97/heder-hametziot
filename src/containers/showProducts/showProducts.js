import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./showProducts.module.css";
import withClass from "../../hoc/withClass/withClass";
import Products from "../../components/products/products";
import { useLocation } from "react-router-dom";
import Product from "../../components/product/product";

const ShowProducts = () => {
  const location = useLocation();
  let pathName = location.pathname;
  let paramsCategory = decodeURI(pathName).split("/").filter((ele) => ele !== "");

  return (
    <Aux>
      {paramsCategory[3] ? <Product /> : <Products />}
    </Aux>
  );
};

export default withClass(ShowProducts, classes.ShowProducts);
