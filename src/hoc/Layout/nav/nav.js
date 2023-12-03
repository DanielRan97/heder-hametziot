import Aux from "../../Auxiliary/Auxiliary";
import withClass from "../../withClass/withClass";
import classes from "./nav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Nav = (props) => {
  return (
    <Aux>
      <div className={`${classes.flexItem} ${classes.menuToggle}`}>
        <button className={classes.toggleMenuButton} onClick={props.handelMenu}>
          <FontAwesomeIcon icon={faBars} />
          תפריט
        </button>
      </div>
      <div className={`${classes.flexItem} ${classes.title}`}>
        <h1>חדר המציאות</h1>
      </div>
    </Aux>
  );
};

export default withClass(Nav, classes.Nav);
