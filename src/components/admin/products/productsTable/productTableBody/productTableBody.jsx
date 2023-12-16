import React from "react";
import Loading from "../../../../UI/loading/loading";
import classes from "../productsTable.module.css";

const ProductTableBody = (props) => {
  

  if (props.loading) {
    return (
      <tr>
        <td colSpan="17S">
          <Loading />
        </td>
      </tr>
    );
  }

  if (props.filterProductsState && props.filterProductsState.length === 0) {
    return (
      <tr>
        <td colSpan="17">אין מוצרים זמינים</td>
      </tr>
    );
  }
  return  props.filterProductsState.map((ele, index) => (
    <tr key={ele.id + index}>
      <td>{index + 1}</td>
      <td>{ele.name}</td>
      <td>{ele.description}</td>
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
        {ele.photos[0] && (
          <img
            className={classes.productImg}
            src={ele.photos[0]}
            alt="תמונה ראשית"
            onError={() => props.handleImageError(ele)}
          />
        )}
      </td>
      <td>{props.getProductWatch(ele.fbId)}</td>
      <td>{props.getProductClicks(ele.fbId)}</td>
      <td>
        <button
          type="button"
          className={classes.showProduct}
          onClick={() => props.showProduct(ele)}
        >
          הצג מוצר
        </button>
      </td>
      <td>
      <a href={ele.link}
      target="_blank"
      rel="noreferrer"
          className={classes.showInAliButton}>
          הצג באלי אקספרס
        </a>
      </td>
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

export default ProductTableBody;
