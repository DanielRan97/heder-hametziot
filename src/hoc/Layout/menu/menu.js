import { useState, useEffect } from "react";
import { getTypes, logout } from "../../../fireBase/fireBaseFunc";
import { auth } from "../../../fireBase/firebase";
import Aux from "../../Auxiliary/Auxiliary";
import withClass from "../../withClass/withClass";
import classes from "./menu.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const Menu = (props) => {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let categories = [];
      getTypes().then((res) => {
        setTypes(res);
        res.forEach((element) => {
          categories.push(element.category);
        });
        setCategories(categories);
      });
    } catch (error) {
      setTypes([]);
    }
  }, []);

  const logOutHandler = async () => {
    await logout();
    props.setMenu(false);
    navigate("/");
  };

  const setTypesList = () => {
    let uniqCategory = [...new Set(categories)];
  
    if (types.length > 0) {
      return (
        <div className={classes.categoriesList}>
          <ul>
            {uniqCategory.map((element) => (
              <li
                className={classes.categories}
                key={element}
                onClick={() =>
                  category !== element ? setCategory(element) : setCategory("")
                }
              >
                {element}
                {element === category ? (
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className={classes.categoriesDownButton}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={classes.categoriesDownButton}
                  />
                )}
                {element === category && (
                  <ul className={classes.typesUl}>
                    {types
                      .filter((type) => type.category === element)
                      .map((type) => (
                        <li key={type.type} className={classes.typesLi}>{type.type}</li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };
  

  return (
    <Aux>
      <h1>תפריט</h1>
      {setTypesList()}
      {auth.currentUser?.uid ? (
        <button onClick={logOutHandler} className={classes.logOutButton}>
          <p>התנתק</p>
        </button>
      ) : null}
    </Aux>
  );
};

export default withClass(Menu, classes.Menu);
