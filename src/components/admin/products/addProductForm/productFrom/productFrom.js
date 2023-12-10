import React from 'react';
import Aux from '../../../../../hoc/Auxiliary/Auxiliary';
import Loading from "../../../../UI/loading/loading";
import classes from './productFrom.module.css';

const ProductForm = props => {

  return (
    <Aux>
      <form className={classes.productForm}>
        <h1>העלה מוצר</h1>
        <label>
          <h4> שם:</h4>
          <input
            type="text"
            value={props.addProductFromState.name}
            onChange={(e) =>
                props.setAddProductFromState({
                ...props.addProductFromState,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          <h4>מחיר:</h4>
          <input
            type="number"
            value={props.addProductFromState.price}
            onChange={(e) =>
                props.setAddProductFromState({
                ...props.addProductFromState,
                price: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label>
          <h4>קטגוריה:</h4>
          <select
            value={props.addProductFromState.categories}
            onChange={(e) =>
                props.setAddProductFromState({
                ...props.addProductFromState,
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
            value={props.addProductFromState.types}
            onChange={(e) =>
                props.setAddProductFromState({
                ...props.addProductFromState,
                types: e.target.value,
              })
            }
          >
            <option value="" disabled>
              בחר תת קטגוריה
            </option>
            {props.types
              .filter(
                (element) => element.category === props.addProductFromState.categories
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
              checked={props.addProductFromState.gender === "נקבה"}
              onChange={(e) =>
                props.setAddProductFromState({
                  ...props.addProductFromState,
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
              checked={props.addProductFromState.gender === "זכר"}
              onChange={(e) =>
                props.setAddProductFromState({
                  ...props.addProductFromState,
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
              checked={props.addProductFromState.gender === "שניהם"}
              onChange={(e) =>
                props.setAddProductFromState({
                  ...props.addProductFromState,
                  gender: e.target.value,
                })
              }
            />
          </label>
        </label>
        <label>
          <h4>תיאור מוצר:</h4>
          <textarea
            value={props.addProductFromState.description}
            onChange={(e) =>
                props.setAddProductFromState({
                ...props.addProductFromState,
                description: e.target.value,
              })
            }
          ></textarea>
        </label>
        <label>
          <h4>לינק:</h4>
          <input
            type="text"
            value={props.addProductFromState.link}
            onChange={(e) =>
                props.setAddProductFromState({
                ...props.addProductFromState,
                link: e.target.value,
              })
            }
          />
          {!props.isValidUrl(props.addProductFromState.link) &&
          props.addProductFromState.link !== "" ? (
            <p className={classes.addSFailedMessage}>לינק לא תקין</p>
          ) : null}
        </label>

        <label>
          <h4>העלה תמונות</h4>

          <input type="file" onChange={props.handleChange} multiple />
        </label>
        <p className={props.addSProductMessage.type === "error"? classes.addSFailedMessage : classes.addSuccessMessage}>
          {props.addProductLoading === <Loading />
            ? props.addProductLoading
            : props.addSProductMessage.message}
        </p>
        {props.addProductLoading && <Loading />}
        <button
          type="button"
          disabled={props.addFormButtonDisabled()}
          onClick={props.addProductHandler}
        >
          הוסף מוצר
        </button>
      </form>
    </Aux>
  );
};

export default ProductForm;