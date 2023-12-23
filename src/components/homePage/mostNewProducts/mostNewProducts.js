import React, { useState, useEffect } from "react";
import classes from "./mostNewProducts.module.css";
import { useNavigate } from "react-router-dom";
import withClass from "../../../hoc/withClass/withClass";
import Aux from "../../../hoc/Auxiliary/Auxiliary";

const MostNewProducts = (props) => {
  const [mostNewProducts, setMostNewProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMostWatch = () => {
      if (
        !Array.isArray(props.productState) ||
        props.productState.length === 0
      ) {
        return [];
      }
      const sortedArray = props.productState.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const top10Array = sortedArray.slice(0, 10);
      setMostNewProducts(top10Array);
    };

    getMostWatch();
  }, [props.productState]);

  const renderProducts = () => {
    return mostNewProducts.map((ele, index) => (
      <div
        key={index}
        className={classes.imgDiv}
        onClick={() =>
          navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`)
        }
      >
        <img src={ele.photos[0]} alt={ele.name} />
        <p className={classes.imgTitle}>{ele.name}</p>
      </div>
    ));
  };

  return (
    <Aux>
      <h2 className={classes.title}>הכי חדשים</h2>
      {renderProducts()}
    </Aux>
  );
};

export default withClass(MostNewProducts, classes.MostNewProducts);
