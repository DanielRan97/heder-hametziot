import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import { useState, useEffect } from "react";
import {
  getTypes,
  addProduct,
  getCategories,
} from "../../../../fireBase/fireBaseFuncDb";
import ModalDialog from "../../../UI/modal/modal";
import ProductForm from "./productFrom/productFrom";
import { handleUploadImgs } from "../../../../fireBase/fireBaseStorage";

const AddProductForm = props => {
  const [addProductFromState, setAddProductFromState] = useState({
    name: "",
    price: 0,
    categories: "",
    types: "",
    description: "",
    gender: "",
    link: "",
  });
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addSProductMessage, setAddSProductMessage] = useState({
    message: "",
    type: "",
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

  useEffect(() => {
    return () => {
      localStorage.setItem('addProductState', JSON.stringify(addProductFromState));
    };
  }, [addProductFromState]);

  useEffect(() => {
    const savedState = localStorage.getItem('addProductState');

    if (savedState) {
      setAddProductFromState(JSON.parse(savedState));
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
    const { name, price, categories, types, description, gender, link } =
      addProductFromState;
    return (
      name === "" ||
      price === 0 ||
      categories === "" ||
      types === "" ||
      description === "" ||
      gender === "" ||
      !isValidUrl(link) ||
      !productImgs.length > 0
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
          type: "error",
        });
      }
      await addProduct({
        ...addProductFromState,
        createdAt: new Date().toISOString(),
        clicks: 0,
        watches: 0,
        photos: images,
        id,
      })

      setAddSProductMessage({
        message: "המוצר נוסף בהצלחה",
        type: "success",
      });
      setProductImgs([]);
      setAddProductFromState({
        name: "",
        price: 0,
        categories: addProductFromState.categories,
        types: addProductFromState.types,
        description: "",
        gender: "",
        link: "",
      });

      setAddProductLoading(false);
    } catch (error) {
      setAddProductLoading(false);
      setAddSProductMessage({
        message: "העלת מוצר נכשלה",
        type: "error",
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
      <ProductForm
        addProductFromState={addProductFromState}
        setAddProductFromState={(ele) => setAddProductFromState(ele)}
        categories={categories}
        types={types}
        isValidUrl={(ele) => isValidUrl(ele)}
        handleChange={(e) => handleChange(e)}
        addProductLoading={addProductLoading}
        addFormButtonDisabled={() => addFormButtonDisabled()}
        addProductHandler={() => addProductHandler()}
        addSProductMessage={addSProductMessage}
      />
    </Aux>
  );
};

export default AddProductForm;
