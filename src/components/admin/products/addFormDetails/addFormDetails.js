import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import { useState, useEffect } from "react";
import { addCategory, getCategories, addType, getTypes } from "../../../../fireBase/fireBaseFunc";
import classes from "./addFormDetails.module.css";
import ModalDialog from '../../../UI/modal/modal';

const AddFormDetails = () => {
  const [categoryState, setCategoryState] = useState("");
  const [typeState, setTypeState] = useState({ category: "", type: "" });
  const [categoryListState, setCategoryListState] = useState([]);
  const [categoryFeedBack, setCategoryFeedBack] = useState({message : '', type:''});
  const [typeFeedBack, setTypeFeedBack] = useState({message : '', type:''});
  const [modal, setModal] = useState({show:false, title:"", text:""});

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
      setModal({show:true, title:"שגיאה", text:"שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט"})
    }
  }, []);

  const addCategoryHandler = async () => {
    try {
      if (categoryListState.includes(categoryState)) {
        setCategoryFeedBack({ message: `${categoryState} כבר קיים`, type: 'error' });
      } else {
        await addCategory(categoryState);
        setCategoryListState((prevArray) => [...prevArray, categoryState]);
        setCategoryFeedBack({ message: `${categoryState} נוסף בהצלחה`, type: 'success' });
      }
    } catch (error) {
      setModal({show:true, title:"שגיאה", text:"שגיאה בהוספת נתונים, בדוק את חיבור האינטרנט"})
    }
  };

  const addTypesHandler = async () => {
    try {
      const res = await getTypes();
      if(res !== null){
        const includesObject = res.some((obj) => obj.category === typeState.category && obj.type === typeState.type);
        if (includesObject) {
          setTypeFeedBack({ message: `${typeState.type} כבר קיים`, type: 'error' });
        } else {
          await addType(typeState);
          setTypeFeedBack({ message: `${typeState.type} נוסף בהצלחה`, type: 'success' });
        }
      }else {
          await addType(typeState);
          setTypeFeedBack({ message: `${typeState.type} נוסף בהצלחה`, type: 'success' });
      }

    } catch (error) {
      setModal({show:true, title:"שגיאה", text:"שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט"});
    }
  };

  return (
    <Aux>
      {modal.show ? <ModalDialog title={modal.title} text={modal.text} onModalClose={() => setModal({show:false, title:"", text:""})}/> : null}
      <div>
        <form className={classes.FormDetails}>
          <h1>הוסף קטגוריה</h1>
          <label>
            שם הקטגוריה:
            <input
              type="text"
              onChange={(e) => setCategoryState(e.target.value)}
            />
          </label>
          <p className={categoryFeedBack.type === 'error' ? classes.feedbackError : classes.feedbackSuccess}>{categoryFeedBack.message !== ''? categoryFeedBack.message : null}</p>
          <button
            type="button"
            onClick={addCategoryHandler}
            disabled={categoryState === ""}
          >
            הוסף קטגוריה
          </button>
        </form>

        <form className={classes.FormDetails}>
          <h1>הוסף תת קטגוריה</h1>

          <label>
            {" "}
            הוסף קטגוריה :
            <select
              value={typeState.category}
              onChange={(e) =>
                setTypeState({ ...typeState, category: e.target.value })
              }
            >
              <option value="" disabled>
                בחר קטגוריה
              </option>
              {categoryListState.length > 0 ? (
                categoryListState.map((element, index) => (
                  <option value={element} key={index}>
                    {element}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  עדיין אין קטגוריות
                </option>
              )}
            </select>
          </label>

          <label>
            שם תת קטגוריה:
            <input
              type="text"
              onChange={(e) =>
                setTypeState({ ...typeState, type: e.target.value })
              }
            />
          </label>
          <p className={typeFeedBack.type === 'error' ? classes.feedbackError : classes.feedbackSuccess}>{typeFeedBack.message !== ''? typeFeedBack.message : null}</p>
          <button
            type="button"
            disabled={typeState.category === "" || typeState.type === ""}
            onClick={addTypesHandler}>
            הוסף תת קטגוריה
          </button>
        </form>
      </div>
    </Aux>
  );
};

export default AddFormDetails;
