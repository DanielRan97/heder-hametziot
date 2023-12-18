import React, { useState } from "react";
import Aux from "../../Auxiliary/Auxiliary";
import withClass from "../../withClass/withClass";
import classes from "./nav.module.css";
import title from "../../../assets/hederHametziotTitle/hederHametziotTitle.png";

const Nav = () => {
  const [preventContextMenu] = useState(true);

  const handleContextMenu = (e) => {
    if (preventContextMenu) {
      e.preventDefault();
    }
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <Aux>
      <div>
        <img
          src={title}
          alt="חדר המציאות"
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        />
      </div>
    </Aux>
  );
};

export default withClass(Nav, classes.Nav);
