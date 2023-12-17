import React, { useState } from "react";
import Aux from "../../../../../hoc/Auxiliary/Auxiliary";
import classes from "./addFormDetailsForm.module.css";
import DialogComponent from "../../../../UI/dialogComponent/dialogComponent";
import DeleteCategories from "../addFormDetailsForm/deleteCategories/deleteCategories";

const AddFormDetailsForm = (props) => {
  const [detailsDeleteDialog, setDetailsDeleteDialog] = useState(false);

  return (
    <Aux>
      {detailsDeleteDialog ? (
        <DialogComponent
          closeDialog={() =>
            setDetailsDeleteDialog(
              !detailsDeleteDialog ? detailsDeleteDialog : !detailsDeleteDialog
            )
          }
        >
          <DeleteCategories
            deleteCategoryHandler={(category) =>
              props.deleteCategoryHandler(category)
            }
            categoryListState={props.categoryListState}
            typesStateList={props.typesStateList}
          />
        </DialogComponent>
      ) : null}
      <form className={classes.FormDetails}>
        <h1>הוסף קטגוריה</h1>
        <label>
         <h4> שם הקטגוריה:</h4>
          <input
            value={props.categoryState}
            type="text"
            onChange={(e) => props.setCategoryState(e.target.value)}
          />
        </label>
        <p
          className={
            props.categoryFeedBack.type === "error"
              ? classes.feedbackError
              : classes.feedbackSuccess
          }
        >
          {props.categoryFeedBack.message !== ""
            ? props.categoryFeedBack.message
            : null}
        </p>
        <button
          type="button"
          onClick={props.addCategoryHandler}
          disabled={props.categoryState === ""}
        >
          הוסף קטגוריה
        </button>
        <button type="button" onClick={() => setDetailsDeleteDialog(true)}>
          מחק קטגוריות
        </button>
      </form>

      <form className={classes.FormDetails}>
        <h1>הוסף תת קטגוריה</h1>

        <label>
        <h4>  הוסף קטגוריה :</h4>
          <select
            value={props.typeState.category}
            onChange={(e) =>
              props.setTypeState({
                ...props.typeState,
                category: e.target.value,
              })
            }
          >
            <option value="" disabled>
             בחר קטגוריה 
            </option>
            {props.categoryListState && props.categoryListState.length > 0 ? (
              props.categoryListState.map((element, index) => (
                <option key={index}>{element}</option>
              ))
            ) : (
              <option value="" disabled>
                עדיין אין קטגוריות
              </option>
            )}
          </select>
        </label>
        <label>
        <h4>  שם תת קטגוריה: </h4>
          <input
            type="text"
            value={props.typeState.type}
            onChange={(e) =>
              props.setTypeState({ ...props.typeState, type: e.target.value })
            }
          />
        </label>
        <p
          className={
            props.typeFeedBack.type === "error"
              ? classes.feedbackError
              : classes.feedbackSuccess
          }
        >
          {props.typeFeedBack.message !== ""
            ? props.typeFeedBack.message
            : null}
        </p>
        <button
          type="button"
          disabled={
            props.typeState.category === "" || props.typeState.type === ""
          }
          onClick={props.addTypesHandler}
        >
           הוסף תת קטגוריה
        </button>
      </form>
    </Aux>
  );
};

export default AddFormDetailsForm;
