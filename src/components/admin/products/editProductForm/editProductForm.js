import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import classes from "./editProductForm.module.css";
import { useState, useEffect } from "react";
import {
  getTypes,
  editProduct,
  getCategories,
  handleEditImgs,
} from "../../../../fireBase/fireBaseFunc";
import ModalDialog from "../../../UI/modal/modal";
import Loading from "../../../UI/loading/loading";

const EditProductForm = (props) => {
  const [editProductFromState, setEditProductFromState] = useState({
    name: props.editProductData.name,
    price: props.editProductData.price,
    categories: props.editProductData.categories,
    types: props.editProductData.types,
    description: props.editProductData.description,
    gender: props.editProductData.gender,
    link: props.editProductData.link,
    photos: props.editProductData.photos,
    fbId: props.editProductData.fbId,
    id: props.editProductData.id
  });
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editSProductMessage, setEditSProductMessage] = useState({
    message: "",
    class: "",
  });
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [editProductLoading, setEditProductLoading] = useState(false);
  const [productImgs, setProductImgs] = useState([]);
  useEffect(() => {
    setEditProductFromState({ ...props.editProductData });
    try {
      getCategories()
        .then((res) => {
          setCategories(res.categories);
          getTypes()
            .then((res) => {
              setTypes(res);
            })
            .catch((err) => {
              setTypes([]);
            });
        })
        .catch((err) => {
          setCategories([]);
        });
    } catch (error) {
      setModal({
        show: true,
        title: "שגיאה",
        text: "שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט",
      });
    }
  }, [props.editProductData]);

  const isValidUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(:\d{1,5})?(\/\S*)?$/i;
    return urlPattern.test(url);
  };

  const editFormButtonDisabled = () => {
    const { name, price, categories, types, description, gender, link } =
      editProductFromState;

    return (
      name === "" ||
      price === 0 ||
      categories === "" ||
      types === "" ||
      description === "" ||
      gender === "" ||
      !isValidUrl(link)
    );
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      setProductImgs(Array.from(e.target.files));
    }
  };

  const editProductHandler = async (id) => {
    setEditProductLoading(true);
    let images = [];
    try {
      if(productImgs.length > 0){
        const res = await handleEditImgs(
          productImgs,
          editProductFromState.id
        );
        if (res) {
          images = res;
        } else {
          setEditProductLoading(false);
          setEditSProductMessage({
            message: "עריכת התמונות נכשלה",
            class: classes.editSFailedMessage,
          });
        }
      }
      await editProduct(id, {
        ...editProductFromState,
        photos: images.length > 0 ? images : editProductFromState.photos
      }).then(() => {
        props.backToTable();
      })
    } catch (error) {
      setEditProductLoading(false);
      setEditSProductMessage({
        message: "עריכת המוצר נכשלה",
        class: classes.editSFailedMessage,
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
      <form className={classes.productForm}>
        <h1>ערוך מוצר</h1>
        <label>
          <h4> שם:</h4>
          <input
            type="text"
            value={editProductFromState.name}
            onChange={(e) =>
              setEditProductFromState({
                ...editProductFromState,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          <h4>מחיר:</h4>
          <input
            type="number"
            value={editProductFromState.price}
            onChange={(e) =>
              setEditProductFromState({
                ...editProductFromState,
                price: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label>
          <h4>קטגוריה:</h4>
          <select
            value={editProductFromState.categories}
            onChange={(e) =>
              setEditProductFromState({
                ...editProductFromState,
                categories: e.target.value,
              })
            }
          >
            <option value="" disabled>
              {categories.length === 0 ? "עדיין אין קטגוריות" : "בחר קטגוריה"}
            </option>
            {categories.map((element, index) => (
              <option value={element} key={index}>
                {element}
              </option>
            ))}
          </select>
        </label>
        <label>
          <h4>תת קטגוריה:</h4>
          <select
            value={editProductFromState.types}
            onChange={(e) =>
              setEditProductFromState({
                ...editProductFromState,
                types: e.target.value,
              })
            }
          >
            <option value="" disabled>
              בחר תת קטגוריה
            </option>
            {types
              .filter(
                (element) =>
                  element.category === editProductFromState.categories
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
              checked={editProductFromState.gender === "נקבה"}
              onChange={(e) =>
                setEditProductFromState({
                  ...editProductFromState,
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
              checked={editProductFromState.gender === "זכר"}
              onChange={(e) =>
                setEditProductFromState({
                  ...editProductFromState,
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
              checked={editProductFromState.gender === "שניהם"}
              onChange={(e) =>
                setEditProductFromState({
                  ...editProductFromState,
                  gender: e.target.value,
                })
              }
            />
          </label>
        </label>
        <label>
          <h4>תיאור מוצר:</h4>
          <textarea
            value={editProductFromState.description}
            onChange={(e) =>
              setEditProductFromState({
                ...editProductFromState,
                description: e.target.value,
              })
            }
          ></textarea>
        </label>
        <label>
          <h4>לינק:</h4>
          <input
            type="text"
            value={editProductFromState.link}
            onChange={(e) =>
              setEditProductFromState({
                ...editProductFromState,
                link: e.target.value,
              })
            }
          />
          {!isValidUrl(editProductFromState.link) &&
          editProductFromState.link !== "" ? (
            <p className={classes.editSFailedMessage}>לינק לא תקין</p>
          ) : null}
        </label>
        <label>
          <h4>העלה תמונות</h4>

          <input type="file" onChange={handleChange} multiple />
        </label>
        <p className={editSProductMessage.class}>
          {editProductLoading === <Loading />
            ? editProductLoading
            : editSProductMessage.message}
        </p>
        {editProductLoading && <Loading />}
        <button
          type="button"
          disabled={editFormButtonDisabled()}
          onClick={() => editProductHandler(editProductFromState.fbId)}
        >
          ערוך מוצר
        </button>
      </form>
    </Aux>
  );
};

export default EditProductForm;
