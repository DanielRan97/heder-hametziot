import { useState, useEffect } from "react";
import { getProductById } from "../../../../fireBase/fireBaseFunc";
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
  let navigate = useNavigate();

  useEffect(() => {
    setProductName("");
    const pathName = decodeURI(location.pathname)
      .split("/")
      .filter((ele) => ele !== "");
    try {
      pathName[3] &&
        getProductById(pathName[3]).then((res) => {
          if(res !== null){
            setProductName(res.name);
          }
        });
    } catch (error) {
      setProductName("");
    }
  }, [location.pathname]);

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
            {pathName[3] && productName !== "" && <span>{productName}</span>}
          </p>
        ) : null}
      </div>
    </Aux>
  );
};

export default withClass(Path, classes.Path);
