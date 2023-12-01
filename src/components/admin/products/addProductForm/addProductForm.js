import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import classes from "./addProductForm.module.css";
import { useState, useEffect } from "react";
import { getTypes, addProduct, getCategories } from "../../../../fireBase/fireBaseFunc";
import ModalDialog from "../../../UI/modal/modal";
import Loading from '../../../UI/loading/loading';

const AddProductForm = (props) => {
  const [addProductFromState, setAddProductFromState] = useState({
    name: "",
    price: 0,
    categories: "",
    types: "",
    description: "",
    gender: "",
    link: "",
    photos: [],
  });
  const [numPhotos, setNumPhotos] = useState(1);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addSProductMessage, setAddSProductMessage] = useState({
    message: "",
    class: "",
  });
  const [modal, setModal] = useState({ show: false, title: "", text: "" });
  const [addProductLoading, setAddProductLoading] = useState(false);

  useEffect(() => {
    try {
      getCategories()
      .then((res) => {
          setCategories(res.categories);
          getTypes().then(res => {
            setTypes(res);
          }).catch(err => {
            setTypes([]);
          })
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

  const addFormButtonDisabled = () => {
    const {
      name,
      price,
      categories,
      types,
      description,
      gender,
      link,
      photos,
    } = addProductFromState;

    return (
      name === "" ||
      price === 0 ||
      categories === "" ||
      types === "" ||
      description === "" ||
      gender === "" ||
      !isValidUrl(link) ||
      photos.length === 0
    );
  };

  const makeImgLinkInput = () => {
    const inputs = [];

    for (let index = 0; index < numPhotos; index++) {
      inputs.push(
        <label key={index}>
          קישור לתמונה:
          {index === 0 ? <p>תמונה ראשית</p> : null}
          <input
            id={index}
            type="text"
            onChange={(e) => handleImgLinkChange(e, index)}
          />
        </label>
      );
    }

    return inputs;
  };

  const handleImgLinkChange = (e, index) => {
    const updatedPhotos = [...addProductFromState.photos];
    updatedPhotos[index] = e.target.value;
    setAddProductFromState({
      ...addProductFromState,
      photos: updatedPhotos,
    });
  };

  const addProductHandler = async () => {
    setAddProductLoading(true);
    try {
      await addProduct(addProductFromState);
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
        link: "",
        photos: [],
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
          שם:
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
          מחיר:
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
          קטגוריה:
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
          תת קטגוריה:
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
        <div>
          מיגדר:
          <label>
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
          <label>
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
          <label>
            מתאים לשניהם
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
          <label>
            תיאור מוצר:
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
            לינק:
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
          {makeImgLinkInput()}
          <button type="button" onClick={() => setNumPhotos(numPhotos + 1)}>
            הוסף תמונה
          </button>
        </div>
        <p className={addSProductMessage.class}>{addProductLoading === <Loading /> ? addProductLoading : addSProductMessage.message}</p>
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
