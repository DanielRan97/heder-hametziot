import React, { useState, useEffect } from "react";
import classes from "./mostHotProducts.module.css";
import { useNavigate } from "react-router-dom";
import withClass from "../../../hoc/withClass/withClass";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
const MostHotProducts = (props) => {
  const [mostHotProducts, setMostHotProducts] = useState([]);
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
        (a, b) => b.clicks - a.clicks
      );
      const top10Array = sortedArray.slice(0, 10);
      setMostHotProducts(top10Array);
    };

    getMostWatch();
  }, [props.productState]);

  const renderProducts = () => {
    return mostHotProducts.map((ele, index) => (
      <div
        key={index}
        className={classes.imgDiv}
        onClick={() =>
          navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`)
        }
      >
        <img src={ele.photos[0]} alt={ele.name} />
        <FontAwesomeIcon className={classes.fireIcon} icon={faFire} />
        <p className={classes.imgTitle}>{ele.name}</p>
      </div>
    ));
  };

  return (
    <Aux>
      <h2 className={classes.title}>הכי חמים</h2>
      {renderProducts()}
    </Aux>
  );
};

export default withClass(MostHotProducts, classes.MostHotProducts);
