import React from "react";
import Loading from "../../../../UI/loading/loading";
import classes from "../productsTable.module.css";
import { comaToBr } from "../../../../../utility/comaToBr";

const ProductTableBodyError = props => {

  if (props.loading) {
    return (
      <tr>
        <td colSpan="17">
          <Loading />
        </td>
      </tr>
    );
  }

  if (props.productsFilterErrorState.length === 0) {
    return (
      <tr>
        <td colSpan="17">אין מוצרים זמינים</td>
      </tr>
    );
  }

  return props.productsFilterErrorState.map((ele, index) => (
    <tr key={ele.id + index}>
      <td>{index + 1}</td>
      <td>{ele.name}</td>
      <td>{comaToBr(ele.description)}</td>
      <td>₪{ele.price}.00</td>
      <td>{ele.categories}</td>
      <td>{ele.types}</td>
      <td>{ele.gender === "שניהם" ? "יוניסקס" : ele.gender}</td>
      <td>{`${new Date(ele.createdAt).getDate().toLocaleString()}/${
        new Date(ele.createdAt).getMonth() + 1
      }/${new Date(ele.createdAt).getFullYear().toLocaleString()}`}</td>
      <td>
        <a href={ele.link} target="_blank" rel="noreferrer noopener">
          {ele.link}
        </a>
      </td>
      <td>
      <p>תמונה ראשית לא עובדת</p>
      </td>
      <td>
        <button
          type="button"
          className={classes.showProduct}
          onClick={() => props.showProduct(ele)}
        >
          הצג מוצר
        </button>
      </td>
      <td></td>
      <td>
        <button
          type="button"
          className={classes.editProductButton}
          onClick={() => props.editPage(ele)}
        >
          עריכה
        </button>
      </td>
      <td>
        {props.deleteDialog !== ele.fbId ? (
          <button
            type="button"
            className={classes.deleteProductButton}
            onClick={() => props.deleteDialogHandler(ele.fbId)}
          >
            מחיקה
          </button>
        ) : (
          <div>
            <button
              className={classes.deleteDialogProductButton}
              onClick={() => props.removeP(ele.fbId, ele.id, false)}
            >
              {props.deleteLoading ? <Loading /> : "מחיקה"}
            </button>
            {!props.deleteLoading && (
              <button
                className={classes.deleteDialogCancelProductButton}
                onClick={() => props.cancelDeleteDialogHandler()}
              >
                ביטול
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  ));
};

export default ProductTableBodyError;
