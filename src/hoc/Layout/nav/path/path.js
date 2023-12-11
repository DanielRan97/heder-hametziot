import React, { useState, useEffect } from "react";
import { getProductById } from "../../../../fireBase/fireBaseFuncDb";
import Aux from "../../../Auxiliary/Auxiliary";
import withClass from "../../../withClass/withClass";
import classes from "./path.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import ModalDialog from "../../../../components/UI/modal/modal";

const Path = () => {
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const location = useLocation();
  const pathName = decodeURI(location.pathname)
    .split("/")
    .filter((ele) => ele !== "");
  const [productName, setProductName] = useState();
  const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {

    if(pathName[3]){
      await getProductById(pathName[3]).then(res => {
        setProductName(res.name)
      })
    }
  }
  fetchData()
}, [pathName])


  return (
    <Aux>
      {modal.show ? (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      ) : null}
      <div className={classes.path}>
        <span onClick={() => navigate("/")}>
          עמוד הבית{pathName[0] ? "/" : null}
        </span>
        {pathName.length > 0 ? (
          <p>
            {pathName[0] && <span>{`מוצרים`}</span>}
            {pathName[1] && pathName[1] !== "search" && <span>/</span>}
            {pathName[1] && pathName[1] !== "search" && (
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
