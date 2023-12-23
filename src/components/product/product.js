import React, { useState, useEffect, useRef } from "react";
import { editProduct, getProductById } from "../../fireBase/fireBaseFuncDb";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from "./product.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../UI/loading/loading";
import { auth } from "../../fireBase/firebase";
import { comaToBr } from "../../utility/comaToBr";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

const Product = () => {
  const [product, setProduct] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const [mainPhoto, setMainPhoto] = useState("");
  const [productId, setProductId] = useState("");
  const [preventContextMenu] = useState(true);
  const targetDivRef = useRef(null);

  const handleContextMenu = (e) => {
    if (preventContextMenu) {
      e.preventDefault();
    }
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };
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

  const renderSharesButtons = () => {
    return (
      <span>
        <WhatsappShareButton
          className={classes.shareButton}
          url={`https://heder-hametziot.web.app/${location.pathname}`}
          title={product.name}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <TelegramShareButton
          className={classes.shareButton}
          url={`https://heder-hametziot.web.app/${location.pathname}`}
          title={product.name}
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </span>
    );
  };

  const scrollToDiv = (ele) => {
    setMainPhoto(ele !== mainPhoto && ele);
    targetDivRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const renderProducts = () => {
    if (Object.keys(product).length > 0) {
      return (
        <div className={classes.productTemplate}>
          <h1 ref={targetDivRef}>{product.name}</h1>
          <img
            src={mainPhoto}
            alt={product.name}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            className={classes.mainImg}
          ></img>
          <div className={classes.photosDiv}>
            {product.photos.map(
              (ele, index) =>
                ele !== mainPhoto && (
                  <img
                    key={index}
                    src={ele}
                    alt={product.name}
                    className={classes.img}
                    onClick={() => {
                      scrollToDiv(ele);
                    }}
                  ></img>
                )
            )}
          </div>
          <p className={classes.description}>{comaToBr(product.description)}</p>
          <p className={classes.categories}>
            קטגוריות:
            <span
              className={classes.categoriesLink}
              onClick={() => navigate(`/products/${product.categories}`)}
            >
              {product.categories}
            </span>
            ,
            <span
              className={classes.categoriesLink}
              onClick={() =>
                navigate(`/products/${product.categories}/${product.types}`)
              }
            >
              {product.types}{" "}
            </span>
          </p>
          <p className={classes.shareP}>שיתוף : {renderSharesButtons()} </p>
          <p className={classes.alert}>
            {" "}
            <span className={classes.alertTitle}> שימו לב ! </span>ייתכן ובקישור יופיע מוצר אחר, יש לוודא שאתם מסמנים את המוצר בלינק לפי הקוד, האות
            או המספר שמופיע על התמונה של המוצר שבחרתם ושקראתם את <br/>תקנון האתר
          </p>
          <p className={classes.price}>₪{product.price}.00</p>
          <div className={classes.sharesDiv}>{renderSharesButtons()} </div>
          <a
            className={classes.Alink}
            href={product.link}
            target="blank"
            onClick={() => clickOnProduct()}
          >
            קנה עכשיו
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
