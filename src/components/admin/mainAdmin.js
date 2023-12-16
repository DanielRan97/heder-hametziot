import Products from "./products/products";
import Loading from "../UI/loading/loading";
import { auth } from "../../fireBase/firebase";
import { useEffect, useState } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import { getVisits } from "../../fireBase/fireBaseFuncDb";
import classes from "./mainAdmin.module.css";
import withClass from "../../hoc/withClass/withClass";

const MainAdmin = () => {
    const [admin] = useState(auth.currentUser);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true); // Introduce a loading state
    const productPage = <Products />;
  
    useEffect(() => {
        let visitsArray = []
      getVisits().then((res) => {
        if(res !== null ){
            visitsArray = Object.values(res)
            setVisits(visitsArray)
            setLoading(false)
        }else{
            setVisits([])
            setLoading(false)
        }
      });
    }, []);
  
    return (
      <Aux>
        {admin.displayName && <h1>שלום, {admin.displayName}</h1>}
        <div className={classes.siteDataDiv}>
          {loading ? (
            <Loading />
          ) : (
              <details>
                <summary>נתונים</summary>
                <p>כניסות לאתר: {visits.length > 0 ? visits.length : 0}</p>
              </details>
          )}
        </div>
        {productPage}
      </Aux>
    );
  };
  
  export default withClass(MainAdmin, classes.MainAdmin);