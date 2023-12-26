import { useState } from "react";
import Aux from "../../../Auxiliary/Auxiliary";
import classes from "./searchBar.module.css";
import withClass from "../../../withClass/withClass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchBar = (props) => {
  const [searchState, setSearchState] = useState("");
  const navigate = useNavigate();

  const searchHandler = (productName) => {
    setSearchState(productName);
  };

  const search = () => {
    navigate(`/products/search/${searchState}`);
  };

  return (
    <Aux>
      <div className={classes.firstChilde}>
        <button className={classes.toggleMenuButton} onClick={props.handelMenu}>
          <FontAwesomeIcon icon={faBars} />
          תפריט
        </button>
      </div>
      <div className={classes.secondChilde}>
        <form onSubmit={search}>
          <input
            value={searchState}
            className={classes.searchInput}
            type="text"
            placeholder="חפש את שם המוצר..."
            onChange={(e) => searchHandler(e.target.value)}
          ></input>
          {searchState !== "" && (
            <button
              type="button"
              className={classes.searchButton}
              onClick={search}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          )}
        </form>
      </div>
    </Aux>
  );
};

export default withClass(SearchBar, classes.SearchBar);
