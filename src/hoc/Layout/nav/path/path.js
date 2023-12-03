import React, { useState, useEffect } from "react";
import { getProductById, getProducts } from "../../../../fireBase/fireBaseFunc";
import Aux from "../../../Auxiliary/Auxiliary";
import withClass from "../../../withClass/withClass";
import classes from "./path.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const Path = () => {
  const location = useLocation();
  const pathName = decodeURI(location.pathname)
    .split("/")
    .filter((ele) => ele !== "");
  const [productName, setProductName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductName("");

        if (pathName[1]) {
          const products = await getProducts();

          const pathMatchCategory = Object.values(products).some(
            (product) => product.categories === pathName[1]
          );
          if (!pathMatchCategory) {
            navigate("/");
            return;
          }

          const pathMatchType = pathName[2]
            ? Object.values(products).some(
                (product) => product.types === pathName[2]
              )
            : true;

          if (!pathMatchType) {
            navigate("/");
            return;
          }

          if (pathMatchCategory && pathName[3]) {
            const product = await getProductById(pathName[3]);
            if (product !== null) {
              setProductName(product.name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProductName(""); // Handle error by resetting productName
      }
    };

    fetchData();
  }, [location.pathname, navigate, pathName]);

  return (
    <Aux>
      <div className={classes.path}>
        <span onClick={() => navigate("/")}>
          עמוד הבית{pathName[0] ? "/" : null}
        </span>
        {pathName.length > 0 ? (
          <p>
            {pathName[0] && <span>{`מוצרים`}</span>}
            {pathName[1] && <span>/</span>}
            {pathName[1] && (
              <span
                onClick={() => navigate(`products/${pathName[1]}`)}
              >{`${pathName[1]}`}</span>
            )}
            {pathName[2] && <span>/</span>}
            {pathName[2] && (
              <span
                onClick={() =>
                  navigate(`products/${pathName[1]}/${pathName[2]}`)
                }
              >{`${pathName[2]}`}</span>
            )}
            {pathName[3] && <span>/</span>}
            {pathName[3] && productName !== "" && (
              <span>{productName}</span>
            )}
          </p>
        ) : null}
      </div>
    </Aux>
  );
};

export default withClass(Path, classes.Path);
