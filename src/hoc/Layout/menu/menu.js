import {useState, useEffect } from "react";
import { logout } from "../../../fireBase/fireBaseFunc";
import { auth } from "../../../fireBase/firebase";
import Aux from "../../Auxiliary/Auxiliary";
import withClass from "../../withClass/withClass";
import classes from "./menu.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight, faXmark } from "@fortawesome/free-solid-svg-icons";

const Menu = (props) => {

  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(category !== ""){
      const menu = document.getElementById('category');
      menu.classList.add('animate__animated', 'animate__fadeIn');
    }


  }, [category]);
  
  const logOutHandler = async () => {
    await logout();
    props.setMenu(false);
    navigate("/");
  };

  const homepageLinkHandler = () => {
    props.setMenu();
    navigate('/');
  }

  const typesHandler = (category, type) => {
    navigate(`/products/${category}/${type}`);
    props.setMenu();
  };

  const setTypesList = () => {
    let uniqCategory = [...new Set(props.categories)];

      return (
        <div className={classes.categoriesList}>
          <ul>
          <li
                className={classes.categories}
                key='homePage'
                onClick={() =>
                  homepageLinkHandler()
                }
              >
                עמוד הבית
              </li>
            {props.types !== undefined && props.types !== null && props.types.length > 0 &&
            uniqCategory.map((element, index) => (
              <li
                className={classes.categories}
                key={index}
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
                  <ul id={element === category ? "category" : "nonCategory"} className={classes.typesUl}>
                    {props.types
                      .filter((type) => type.category === element)
                      .map((type , index) => (
                        <li
                          key={index + 1000000}
                          className={classes.typesLi}
                          onClick={() => typesHandler(type.category, type.type)}
                        >
                          {type.type}
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
  };

  return (
    <Aux>
      <h1>תפריט</h1>
      <button
        type="button"
        className={classes.closeButton}
        onClick={props.setMenu}
      >
        {" "}
        <FontAwesomeIcon
          icon={faXmark}
          className={classes.categoriesDownButton}
        />
      </button>
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
