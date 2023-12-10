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
import ProductForm from "./productFrom/productFrom";

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
 <ProductForm 
 editProductFromState={editProductFromState}
 setEditProductFromState={(ele) => setEditProductFromState(ele)}
 categories={categories}
 types={types}
 isValidUrl={(ele) => isValidUrl(ele)}
 handleChange={(e) => handleChange(e)}
 editProductLoading={editProductLoading}
 editSProductMessage={editSProductMessage}
 editFormButtonDisabled={() => editFormButtonDisabled()}
 editProductHandler={(id) => editProductHandler(id) }/>
    </Aux>
  );
};

export default EditProductForm;
