import { useLocation, useNavigate } from "react-router-dom";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import withClass from "../../hoc/withClass/withClass";
import classes from './showSearch.module.css';
import { useState, useEffect } from "react";
import Loading from "../UI/loading/loading";
import { getProducts } from "../../fireBase/fireBaseFuncDb";
import  ModalDialog  from "../UI/modal/modal";

const ShowSearch = () => {
    const location = useLocation();
      const [productsState, setProductsState] = useState([]);
      let pathName = location.pathname;
      let paramsName = decodeURI(pathName)
        .split("/")
        .filter((ele) => ele !== "");
      const [modal, setModal] = useState({ show: false, title: "", text: "" });
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();

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
                && ele.name.includes(paramsCategory[2])
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

      const navTo = ele => {
        navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`)
      }
      
      const renderProducts = () => {
       return productsState.length > 0 && productsState.map(ele => (
                <div key={ele.id} onClick={() => navTo(ele)}>
                <div className={classes.product}>
                    <img src={ele.photos[0]} alt={ele.name}></img>
                    <div className={classes.data}>
                   <h4 className={classes.name}>{ele.name}</h4>
                   <p className={classes.description}>{ele.description}</p>
                   <h4 className={classes.price}>₪{ele.price}</h4>
                   </div>
                </div>
                <hr />
                </div>
       ))
      }

      return(
        <Aux>
      {modal.show ? (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      ) : null}
            {loading ? <Loading /> 
            : productsState.length > 0 ? <h3 className={classes.showResTitle}>תוצאות חיפוש : {paramsName[2]}</h3> : <h3 className={classes.showResTitle}>לא נמצאו מוצרים</h3>}
            {renderProducts()}
        </Aux>
    )
}

export default withClass(ShowSearch, classes.ShowSearch);