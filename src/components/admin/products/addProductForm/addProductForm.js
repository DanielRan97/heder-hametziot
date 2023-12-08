import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import classes from "./addProductForm.module.css";
import { useState, useEffect } from "react";
import {
  getTypes,
  addProduct,
  getCategories,
  handleUploadImgs,
} from "../../../../fireBase/fireBaseFunc";
import ModalDialog from "../../../UI/modal/modal";
import Loading from "../../../UI/loading/loading";

const AddProductForm = () => {
  const [addProductFromState, setAddProductFromState] = useState({
    name: "",
    price: 0,
    categories: "",
    types: "",
    description: "",
    gender: "",
    link: ""
  });
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addSProductMessage, setAddSProductMessage] = useState({
    message: "",
    class: "",
  });
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [productImgs, setProductImgs] = useState([]);

  useEffect(() => {
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
  }, []);

  const isValidUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(:\d{1,5})?(\/\S*)?$/i;
    return urlPattern.test(url);
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      setProductImgs(Array.from(e.target.files));
    }
  };

  const addFormButtonDisabled = () => {
    const {
      name,
      price,
      categories,
      types,
      description,
      gender,
      link
    } = addProductFromState;

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

  const addProductHandler = async () => {
    setAddProductLoading(true);
    let images = [];
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    try {
      const res = await handleUploadImgs(productImgs, id);
      if (res) {
        images = res;
      } else {
        setAddSProductMessage({
          message: "העלת תמונות נכשלה",
          class: classes.addSFailedMessage,
        });
      }
       await addProduct({
         ...addProductFromState,
         createdAt: new Date().toISOString(),
         photos: images,
         id
       });

      setAddSProductMessage({
        message: "המוצר נוסף בהצלחה",
        class: classes.addSuccessMessage,
      });

      setAddProductFromState({
        name: "",
        price: 0,
        categories: addProductFromState.categories,
        types: addProductFromState.types,
        description: "",
        gender: "",
        link: ""
      });

      setAddProductLoading(false);
    } catch (error) {
      setAddProductLoading(false);
      setAddSProductMessage({
        message: "העלת מוצר נכשלה",
        class: classes.addSFailedMessage,
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
        <h1>העלה מוצר</h1>
        <label>
          <h4> שם:</h4>
          <input
            type="text"
            value={addProductFromState.name}
            onChange={(e) =>
              setAddProductFromState({
                ...addProductFromState,
                name: e.target.value,
              })
            }
          />
        </label>
        <label>
          <h4>מחיר:</h4>
          <input
            type="number"
            value={addProductFromState.price}
            onChange={(e) =>
              setAddProductFromState({
                ...addProductFromState,
                price: parseFloat(e.target.value) || 0,
              })
            }
          />
        </label>
        <label>
          <h4>קטגוריה:</h4>
          <select
            value={addProductFromState.categories}
            onChange={(e) =>
              setAddProductFromState({
                ...addProductFromState,
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
            value={addProductFromState.types}
            onChange={(e) =>
              setAddProductFromState({
                ...addProductFromState,
                types: e.target.value,
              })
            }
          >
            <option value="" disabled>
              בחר תת קטגוריה
            </option>
            {types
              .filter(
                (element) => element.category === addProductFromState.categories
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
              checked={addProductFromState.gender === "נקבה"}
              onChange={(e) =>
                setAddProductFromState({
                  ...addProductFromState,
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
              checked={addProductFromState.gender === "זכר"}
              onChange={(e) =>
                setAddProductFromState({
                  ...addProductFromState,
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
              checked={addProductFromState.gender === "שניהם"}
              onChange={(e) =>
                setAddProductFromState({
                  ...addProductFromState,
                  gender: e.target.value,
                })
              }
            />
          </label>
        </label>
        <label>
          <h4>תיאור מוצר:</h4>
          <textarea
            value={addProductFromState.description}
            onChange={(e) =>
              setAddProductFromState({
                ...addProductFromState,
                description: e.target.value,
              })
            }
          ></textarea>
        </label>
        <label>
          <h4>לינק:</h4>
          <input
            type="text"
            value={addProductFromState.link}
            onChange={(e) =>
              setAddProductFromState({
                ...addProductFromState,
                link: e.target.value,
              })
            }
          />
          {!isValidUrl(addProductFromState.link) &&
          addProductFromState.link !== "" ? (
            <p className={classes.addSFailedMessage}>לינק לא תקין</p>
          ) : null}
        </label>

        <label>
        <h4>העלה תמונות</h4>

        <input type="file" onChange={handleChange} multiple />
        </label>
        <p className={addSProductMessage.class}>
          {addProductLoading === <Loading />
            ? addProductLoading
            : addSProductMessage.message}
        </p>
        {addProductLoading && <Loading />}
        <button
          type="button"
          disabled={addFormButtonDisabled()}
          onClick={addProductHandler}
        >
          הוסף מוצר
        </button>
      </form>
    </Aux>
  );
};

export default AddProductForm;
