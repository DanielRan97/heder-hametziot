import Aux from "../../../../../../hoc/Auxiliary/Auxiliary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import classes from "./deleteCategories.module.css";
import withClass from "../../../../../../hoc/withClass/withClass";
import {
  faAngleDown,
  faAngleRight,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { deleteType } from "../../../../../../fireBase/fireBaseFuncDb";
import ModalDialog from "../../../../../UI/modal/modal";

const DeleteCategories = (props) => {
  const [categoryState, setCategoryState] = useState("");
  const [types, setTypes] = useState(
    [...new Set(props.typesStateList.map(JSON.stringify))].map(JSON.parse)
  );
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [categoryDelete, setCategoryDelete] = useState("");
  const [typeDelete, setTypeDelete] = useState("");

  const deleteTypeHandler = (type) => {
    try {
      deleteType(type).then((res) => {
        setTypes(res);
      });
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה במחיקת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  return (
    <Aux>
      {modal.show ? (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      ) : null}

      {props.categoryListState &&
        props.categoryListState.map((category, index) => (
          <div className={classes.category} key={index}>
            <p className={classes.categoryP}>
              <FontAwesomeIcon
                icon={categoryState !== category ? faAngleRight : faAngleDown}
                className={classes.faAngleRightIcon}
                onClick={() =>
                  setCategoryState(categoryState === category ? "" : category)
                }
              />
              {category}
              {categoryDelete !== category ?
              <FontAwesomeIcon
                className={classes.trashIcon}
                onClick={() => setCategoryDelete(category)}
                icon={faTrashCan}
              />:
              <FontAwesomeIcon
                className={classes.trashIcon}
                onClick={() => props.deleteCategoryHandler(category)}
                icon={faSquareCheck}
              />}
            </p>
            {[...types]
              .filter((ele) => ele.category === category)
              .map(
                (element, index) =>
                  element.category === categoryState && (
                    <p key={index} className={classes.categoryP}>
                      {element.type}
                      {typeDelete !== element ?
                      <FontAwesomeIcon
                        className={classes.trashIcon}
                        icon={faTrashCan}
                        onClick={() => setTypeDelete(element)}
                      />:
                      <FontAwesomeIcon
                        className={classes.trashIcon}
                        onClick={() => deleteTypeHandler(element)}
                        icon={faSquareCheck}
                      />}
                    </p>
                  )
              )}
          </div>
        ))}
    </Aux>
  );
};

export default withClass(DeleteCategories, classes.DeleteCategories);
