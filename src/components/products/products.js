import { useState, useEffect } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import { getProducts } from "../../fireBase/fireBaseFunc";
import Loading from "../../components/UI/loading/loading";
import classes from "./products.module.css";
import withClass from "../../hoc/withClass/withClass";
import { useLocation, useNavigate } from "react-router-dom";
import ModalDialog from "../UI/modal/modal";

const Products = () => {
  const [productsState, setProductsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: "", text: "" });

  useEffect(() => {
    setProductsState([]);
    let pathName = location.pathname;
    let paramsCategory = decodeURI(pathName)
      .split("/")
      .filter((ele) => ele !== "");
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        const products = Object.entries(res).map(([key, value]) => ({
          ...value,
          fbId: key,
        }));

        const productFilter = products.filter((ele) =>
          paramsCategory[2]
            ? ele.categories === paramsCategory[1] &&
              ele.types === paramsCategory[2]
            : ele.categories === paramsCategory[1]
        );
        setProductsState(productFilter);
      } catch (error) {
        setModal({
          show: true,
          title: "שגיאה",
          text: "שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט",
        });
        setProductsState([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  const handleImageError = (element) => {
    let filter = productsState.filter((ele) => ele !== element);
    setProductsState(filter);
  };

  const renderProducts = () => {
    return productsState.map((ele) => (
      <div
        key={ele.fbId}
        className={classes.product}
        onClick={() =>
          navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`)
        }
      >
        <div className={classes.productImgDiv}>
          <img
            src={ele.photos[0]}
            alt={ele.name}
            onError={() => handleImageError(ele)}
          ></img>
        </div>
        <div className={classes.productData}>
          <h4 className={classes.productTile}>{ele.name}</h4>
          <div className={classes.productDescriptionDiv}>
            <p>{ele.description}</p>
          </div>
          <p className={classes.price}>₪{ele.price}.00</p>
        </div>
      </div>
    ));
  };

  return (
    <Aux>
      {modal.show ? (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      ) : null}
      <div>
        {loading && <Loading />}
        {productsState.length === 0 && loading === false ? (
          <p>עדיין אין מוצרים </p>
        ) : null}
      </div>

      <div className={classes.products}>{renderProducts()}</div>
    </Aux>
  );
};

export default withClass(Products, classes.Products);
