import { useState, useEffect } from "react";
import Aux from "../../../Auxiliary/Auxiliary";
import classes from "./search.module.css";
import { getProducts } from "../../../../fireBase/fireBaseFunc";
import { useNavigate } from "react-router-dom";
import withClass from "../../../withClass/withClass";


const Search = () => {
  const [searchState, setSearchState] = useState("");
  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const [productsState, setProductsState] = useState([]);
  const [filterProductsState, setFilterProductsState] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetAllProducts = async () => {
      try {
        let productArry = [];
        const products = await getProducts();
        Object.entries(products).forEach((ele) => {
          productArry.push({...ele[1], fbId: ele[0]});
        });
        setProductsState(productArry);
      } catch (error) {
        setProductsState([]);
      }
    };

    fetAllProducts();
  }, []);

  const handleImageError = element => {
    let filter = filterProductsState.filter(ele => ele !== element);
    setFilterProductsState(filter);
  };

  const searchHandler = (productName) => {
    setSearchState(productName);
    let filterProductArry = [];
    productsState.forEach(element => {
        element.name.includes(productName) && filterProductArry.push(element);
    });
    setFilterProductsState(filterProductArry);
  };

  const selectResHandler = ele => {
    setSearchState("");
    navigate(`/products/${ele.categories}/${ele.types}/${ele.fbId}`);
  }
  const renderProducts = () => {
    return(
        filterProductsState.length > 0 && searchInputFocus &&
        Object.values(filterProductsState).map((ele, index) => (
            <div key={index} className={classes.resDiv} onClick={() => selectResHandler(ele)}>
                <img src={ele.photos[0]} alt={ele.name} onError={() => handleImageError(ele)}></img>
                <h4  className={classes.resTitle}>{ele.name}</h4>
            </div>
        ))
    )
  }

  return (
    <Aux>
      <form>
        <input
          value={searchState}
          className={classes.searchInput}
          type="text"
          placeholder="חפש מוצר לפי שם"
          onChange={(e) => searchHandler(e.target.value)}
          onFocus={() => setSearchInputFocus(!searchInputFocus)}
          onBlur={() => setSearchInputFocus(!searchInputFocus)}></input>
      </form>

      {searchState !== "" && <div className={classes.resultDiv}>{renderProducts()}</div>}
    </Aux>
  );
};

export default withClass(Search, classes.Search);
