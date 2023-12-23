import Products from "./products/products";
import { auth } from "../../fireBase/firebase";
import { useState } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import classes from "./mainAdmin.module.css";
import withClass from "../../hoc/withClass/withClass";

const MainAdmin = () => {
    const [admin] = useState(auth.currentUser);
    const productPage = <Products />;
  
    return (
      <Aux>
        {admin.displayName && <h1>שלום, {admin.displayName}</h1>}
        {productPage}
      </Aux>
    );
  };
  
  export default withClass(MainAdmin, classes.MainAdmin);