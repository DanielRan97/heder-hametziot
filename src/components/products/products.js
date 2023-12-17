import { useState, useEffect } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import { getProducts } from "../../fireBase/fireBaseFuncDb";
import Loading from "../../components/UI/loading/loading";
import classes from "./products.module.css";
import withClass from "../../hoc/withClass/withClass";
import { useLocation, useNavigate } from "react-router-dom";
import ModalDialog from "../UI/modal/modal";
import ProductFilter from "../../utility/productsFilter";
import { comaToBr } from "../../utility/comaToBr";

const Products = () => {
  const [productsState, setProductsState] = useState([]);
  const [productsFilterState, setProductsFilterState] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [filterValue, setFilterValue] = useState("מהחדש לישן");
  const [filterGender, setFilterGender] = useState("הצג את כל המיגדרים");
  const [preventContextMenu] = useState(true);
  const [photoHover, setPhotoHover] = useState({ id: "", num: 0 });

  const handleContextMenu = (e) => {
    if (preventContextMenu) {
      e.preventDefault();
    }
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    setProductsState([]);
    setFilterValue("מהחדש לישן");
    setFilterGender("הצג את כל המיגדרים");
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
        setProductsState(
          productFilter.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setProductsFilterState(
          productFilter.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
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

  const productHoverHandler = (id, photosArry) => {
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
      }
    }, 0);
    setPhotoHover({ id : "", num: 0 });
    for (let index = 0; index < photosArry.length; index++) {
      setTimeout(() => {
        if (index === photosArry.length - 1) {
          setPhotoHover({ id, num: 1 });
        } else {
          setPhotoHover({ id, num: index + 1 });
        }
      }, 2000 * index);
    }
  };

  const handleImageError = (element) => {
    let filter = productsState.filter((ele) => ele !== element);
    setProductsState(filter);
  };

  const renderProducts = () => {
    return productsFilterState.map((ele) => (
      <div
        key={ele.fbId}
        className={classes.product}
        onClick={() =>
          navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`)
        }
      >
        <img
          src={
            ele.id !== photoHover.id
              ? ele.photos[0]
              : ele.photos[photoHover.num]
          }
          alt={ele.name}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
          onError={() => handleImageError(ele)}
          onMouseEnter={() => productHoverHandler(ele.id, ele.photos)}
          onTouchStart={() => productHoverHandler(ele.id, ele.photos)}
        ></img>
        <div className={classes.productData}>
          <h4 className={classes.productTile}>{ele.name}</h4>
          <div className={classes.productDescriptionDiv}>
            <p>{comaToBr(ele.description)}</p>
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
        {productsFilterState.length === 0 && loading === false ? (
          <p>עדיין אין מוצרים </p>
        ) : null}
      </div>
      {productsState.length > 0 && (
        <div className={classes.productsState}>
          <ProductFilter
            productsFilterState={productsFilterState}
            setProductsFilterState={(sortState) =>
              setProductsFilterState(sortState)
            }
            filterValue={filterValue}
            filterGender={filterGender}
            setFilterGender={(val) => setFilterGender(val)}
            setFilterValue={(val) => setFilterValue(val)}
            products={productsState}
            setProductsState={(sortState) => setProductsState(sortState)}
          />
          <p>{productsFilterState.length} תוצאות</p>
        </div>
      )}
      <div className={classes.products}>{renderProducts()}</div>
    </Aux>
  );
};

export default withClass(Products, classes.Products);
