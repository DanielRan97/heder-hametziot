import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import { useState, useEffect } from "react";
import {
  addCategory,
  getCategories,
  addType,
  getTypes,
  deleteCategory,
} from "../../../../fireBase/fireBaseFuncDb";
import ModalDialog from "../../../UI/modal/modal";
import AddFormDetailsForm from "./addFormDetailsForm/addFormDetailsForm";

const AddFormDetails = props => {
  const [categoryState, setCategoryState] = useState("");
  const [typeState, setTypeState] = useState({ category: "", type: "" });
  const [categoryListState, setCategoryListState] = useState([]);
  const [categoryFeedBack, setCategoryFeedBack] = useState({
    message: "",
    type: "",
  });
  const [typeFeedBack, setTypeFeedBack] = useState({ message: "", type: "" });
  const [modal, setModal] = useState({ show: false, title: "", text: "" });


  useEffect(() => {
    try {
      getCategories()
        .then((res) => {
          setCategoryListState(res.categories);
        })
        .catch((err) => {
          setCategoryListState(["לא נמצאו קטגוריות"]);
        });
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  }, []);

  const addCategoryHandler = async () => {
    try {
      if (categoryListState.includes(categoryState)) {
        setCategoryFeedBack({
          message: `${categoryState} כבר קיים`,
          type: "error",
        });
        setCategoryState("");
      } else {
        await addCategory(categoryState);
        setCategoryListState((prevArray) => [...prevArray, categoryState]);
        setCategoryFeedBack({
          message: `${categoryState} נוסף בהצלחה`,
          type: "success",
        });
        setCategoryState("");
      }
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה בהוספת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  const addTypesHandler = async () => {
    try {
      const res = await getTypes();
      if (res !== null) {
        const includesObject = res.some(
          (obj) =>
            obj.category === typeState.category && obj.type === typeState.type
        );
        if (includesObject) {
          setTypeFeedBack({
            message: `${typeState.type} כבר קיים`,
            type: "error",
          });
          setTypeState({ ...typeState, type: "" });
        } else {
          await addType(typeState);
          setTypeFeedBack({
            message: `${typeState.type} נוסף בהצלחה`,
            type: "success",
          });
          setTypeState({ ...typeState, type: "" });
        }
      } else {
        await addType(typeState);
        setTypeFeedBack({
          message: `${typeState.type} נוסף בהצלחה`,
          type: "success",
        });
        setTypeState({ ...typeState, type: "" });
      }
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  };

  const deleteCategoryHandler = async(category) => {
    try {
      await deleteCategory(category).then(res => {

        setCategoryListState(res)
      })
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה במחיקת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  }
  return (
    <Aux>
      {modal.show ? (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      ) : null}
      <div>
        <AddFormDetailsForm
          typesStateList={props.typesState}
          deleteCategoryHandler={(category) => deleteCategoryHandler(category)}
          categoryState={categoryState}
          setCategoryState={(ele) => setCategoryState(ele)}
          categoryFeedBack={categoryFeedBack}
          typeFeedBack={typeFeedBack}
          addCategoryHandler={() => addCategoryHandler()}
          typeState={typeState}
          setTypeState={(ele) => setTypeState(ele)}
          categoryListState={categoryListState}
          addTypesHandler={() => addTypesHandler()}
        />
      </div>
    </Aux>
  );
};

export default AddFormDetails;
