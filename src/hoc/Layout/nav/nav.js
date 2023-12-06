import React from "react";
import Aux from "../../Auxiliary/Auxiliary";
import withClass from "../../withClass/withClass";
import classes from "./nav.module.css";
import title from '../../../assets/hederHametziotTitle/hederHametziotTitle.png'

const Nav = () => {
  return (
    <Aux>
      <div>
        <img
          src={title}
          alt="חדר המציאות"
        />
      </div>
    </Aux>
  );
};

export default withClass(Nav, classes.Nav);