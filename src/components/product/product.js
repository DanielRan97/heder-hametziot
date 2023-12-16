import React, { useState, useEffect } from "react";
import { editProduct, getProductById } from "../../fireBase/fireBaseFuncDb";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from "./product.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../UI/loading/loading";
import { auth } from "../../fireBase/firebase";

const Product = () => {
  const [product, setProduct] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [mainPhoto, setMainPhoto] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let pathName = location.pathname;
      let paramsCategory = decodeURI(pathName)
        .split("/")
        .filter((ele) => ele !== "");
      setProductId(paramsCategory[3]);
      try {
        setProduct({});
        const res = await getProductById(paramsCategory[3]);
        if (res !== null) {
          setProduct({ ...res });
          setMainPhoto(res.photos[0]);
          if (auth.currentUser === null) {
            editProduct(paramsCategory[3], {
              ...res,
              watches: res.watches + 1,
            });
          }
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

  const clickOnProduct = () => {
    if (auth.currentUser === null) {
      editProduct(productId, {
        ...product,
        watches: product.watches + 1,
        clicks: product.clicks + 1,
      });
    }
  };

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
          <a
            className={classes.Alink}
            href={product.link}
            target="blank"
            onClick={() => clickOnProduct()}
          >
            קנה עכשיו ₪{product.price}.00
          </a>
        </div>
      );
    } else {
      return <Loading />;
    }
  };

  return <Aux>{renderProducts()}</Aux>;
};

export default withClass(Product, classes.Product);
