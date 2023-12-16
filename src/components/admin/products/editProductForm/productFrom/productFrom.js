import React from 'react';
import Aux from '../../../../../hoc/Auxiliary/Auxiliary';
import Loading from "../../../../UI/loading/loading";
import classes from './productFrom.module.css';

const ProductForm = props => {

  return (
    <Aux>
         <form className={classes.productForm}>
        <h1>ערוך מוצר</h1>
        <label>
          <h4> שם:</h4>
          <input
            type="text"
            value={props.editProductFromState.name}
            onChange={(e) =>
              props.setEditProductFromState({
                ...props.editProductFromState,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          <h4>מחיר:</h4>
          <input
            type="number"
            value={props.editProductFromState.price}
            onChange={(e) =>
              props.setEditProductFromState({
                ...props.editProductFromState,
                price: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label>
          <h4>קטגוריה:</h4>
          <select
            value={props.editProductFromState.categories}
            onChange={(e) =>
              props.setEditProductFromState({
                ...props.editProductFromState,
                categories: e.target.value,
              })
            }
          >
            <option value="" disabled>
              {props.categories.length === 0 ? "עדיין אין קטגוריות" : "בחר קטגוריה"}
            </option>
            {props.categories.map((element, index) => (
              <option value={element} key={index}>
                {element}
              </option>
            ))}
          </select>
        </label>
        <label>
          <h4>תת קטגוריה:</h4>
          <select
            value={props.editProductFromState.types}
            onChange={(e) =>
              props.setEditProductFromState({
                ...props.editProductFromState,
                types: e.target.value,
              })
            }
          >
            <option value="" disabled>
              בחר תת קטגוריה
            </option>
            {props.types
              .filter(
                (element) =>
                  element.category === props.editProductFromState.categories
              )
              .map((element, index) => (
                <option value={element.type} key={index}>
                  {element.type}
                </option>
              ))}
          </select>
        </label>
        <label>
          <h4>מיגדר:</h4>
          <label className={classes.radio}>
            נקבה
            <input
              type="radio"
              id="female"
              name="gender"
              value="נקבה"
              checked={props.editProductFromState.gender === "נקבה"}
              onChange={(e) =>
                props.setEditProductFromState({
                  ...props.editProductFromState,
                  gender: e.target.value,
                })
              }
            />
          </label>
          <label className={classes.radio}>
            זכר
            <input
              type="radio"
              id="male"
              name="gender"
              value="זכר"
              checked={props.editProductFromState.gender === "זכר"}
              onChange={(e) =>
                props.setEditProductFromState({
                  ...props.editProductFromState,
                  gender: e.target.value,
                })
              }
            />
          </label>
          <label className={classes.radio}>
            יוניסקס
            <input
              type="radio"
              id="both"
              name="gender"
              value="שניהם"
              checked={props.editProductFromState.gender === "שניהם"}
              onChange={(e) =>
                props.setEditProductFromState({
                  ...props.editProductFromState,
                  gender: e.target.value,
                })
              }
            />
          </label>
        </label>
        <label>
          <h4>תיאור מוצר:</h4>
          <textarea
            value={props.editProductFromState.description}
            onChange={(e) =>
              props.setEditProductFromState({
                ...props.editProductFromState,
                description: e.target.value,
              })
            }
          ></textarea>
        </label>
        <label>
          <h4>לינק:</h4>
          <input
            type="text"
            value={props.editProductFromState.link}
            onChange={(e) =>
              props.setEditProductFromState({
                ...props.editProductFromState,
                link: e.target.value,
              })
            }
          />
          {!props.isValidUrl(props.editProductFromState.link) &&
          props.editProductFromState.link !== "" ? (
            <p className={classes.editSFailedMessage}>לינק לא תקין</p>
          ) : null}
        </label>
        <label>
          <h4>העלה תמונות</h4>

          <input type="file" onChange={props.handleChange} multiple />
        </label>
        <p className={classes.editSProductMessage}>
          {props.editProductLoading === <Loading />
            ? props.editProductLoading
            : props.editSProductMessage.message}
        </p>
        {props.editProductLoading && <Loading />}
        <button
          type="button"
          disabled={props.editFormButtonDisabled()}
          onClick={() => props.editProductHandler(props.editProductFromState.fbId)}
        >
          ערוך מוצר
        </button>
      </form>
    </Aux>
  );
};

export default ProductForm;