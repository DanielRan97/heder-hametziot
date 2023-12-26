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
import { genderFilter } from "../../utility/genderFilter";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const Products = () => {
  const [productsState, setProductsState] = useState([]);
  const [productsFilterState, setProductsFilterState] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [filterValue, setFilterValue] = useState("מהחדש לישן");
  const [filterGender, setFilterGender] = useState("הצג את כל המגדרים");
  const [preventContextMenu] = useState(true);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div style={{ marginTop: "10px" }}>
        <ul style={{ margin: "0", padding: "0", textAlign: "center" }}>
          {dots}
        </ul>
      </div>
    ),
  };

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
    setFilterGender("הצג את כל המגדרים");
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

  const handleImageError = (element) => {
    let filter = productsState.filter((ele) => ele !== element);
    setProductsState(filter);
  };

  const CustomPrevArrow = (props) => {
    return (
      <div className={classes.scrollRight} onClick={props.onClick}>
                          <FontAwesomeIcon icon={faAngleRight} />
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    return (
      <div className={classes.scrollLeft} onClick={props.onClick}>
                          <FontAwesomeIcon icon={faAngleLeft} />
      </div>
    );
  };

  const renderProducts = () => {
    return productsFilterState.map((ele) => (
      <div key={ele.fbId} className={classes.product}>
        <Slider
          {...settings}
          prevArrow={<CustomPrevArrow />}
          nextArrow={<CustomNextArrow />}
        >
          {ele.photos.map((photo, index) => (
            <div key={index} className={classes.slide}>
              <img
                src={photo}
                id={ele.id}
                alt={`Slide ${index}`}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                onError={() => handleImageError(ele)}
                onClick={() =>
                  navigate(
                    `/products/${ele.categories}/${ele.types}/${ele.fbId}`
                  )
                }
              />
            </div>
          ))}
        </Slider>
        <div className={classes.productData}>
          <h4
            className={classes.productTitle}
            onClick={() =>
              navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`)
            }
          >
            {ele.name}
          </h4>
          <div className={classes.productDescriptionDiv}>
            <p>{comaToBr(ele.description)}</p>
            <span>{genderFilter(ele.gender)}</span>
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
