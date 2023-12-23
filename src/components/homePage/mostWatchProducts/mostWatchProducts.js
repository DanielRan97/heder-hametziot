import React, { useState, useEffect } from "react";
import classes from "./mostWatchProducts.module.css";
import { useNavigate } from "react-router-dom";
import withClass from "../../../hoc/withClass/withClass";
import Aux from "../../../hoc/Auxiliary/Auxiliary";

const MostWatchProducts = (props) => {
  const [mostWatchProduct, setMostWatchProduct] = useState([]);
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
        (a, b) => b.watches - a.watches
      );
      const top10Array = sortedArray.slice(0, 12);
      setMostWatchProduct(top10Array);
    };

    getMostWatch();
  }, [props.productState]);

  const renderProducts = () => {
    return mostWatchProduct.map((ele, index) => (
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
      <h2 className={classes.title}>הכי נצפים</h2>
      {renderProducts()}
    </Aux>
  );
};

export default withClass(MostWatchProducts, classes.MostWatchProducts);
