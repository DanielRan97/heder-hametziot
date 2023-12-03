import React, { useState, useEffect } from "react";
import { getProductById } from "../../fireBase/fireBaseFunc";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from "./product.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../UI/loading/loading";

const Product = () => {
  const [product, setProduct] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [mainPhoto, setMainPhoto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let pathName = location.pathname;
      let paramsCategory = decodeURI(pathName)
        .split("/")
        .filter((ele) => ele !== "");

      try {
        setProduct({});
        const res = await getProductById(paramsCategory[3]);
        if (res !== null) {
          setProduct({ ...res });
          setMainPhoto(res.photos[0]);
        } else {
          navigate("/");
        }
      } catch (error) {
        setProduct({});
        navigate("/");
      }
    };

    fetchData();
  }, [location.pathname, navigate]);

  const renderProducts = () => {
    if (Object.keys(product).length > 0) {
      return (
        <div className={classes.productTemplate}>
          <h1>{product.name}</h1>
            <img
              src={mainPhoto}
              alt={product.name}
              className={classes.mainImg}
            ></img>
              {product.photos.map(
                (ele, index) =>
                  ele !== mainPhoto && (
                    <img
                      key={index}
                      src={ele}
                      alt={product.name}
                      className={classes.img}
                      onClick={() => {
                        setMainPhoto(ele !== mainPhoto && ele);
                      }}
                    ></img>
                  )
              )}
                <p className={classes.description}>{product.description}</p>
                <a className={classes.Alink} href={product.link} target="blank">קנה עכשיו</a>
                </div>
      );
    } else {
      return <Loading />;
    }
  };

  return <Aux>{renderProducts()}</Aux>;
};

export default withClass(Product, classes.Product);
