import Aux from "../../hoc/Auxiliary/Auxiliary.js";
import { getProducts } from "../../fireBase/fireBaseFuncDb";
import { useState, useEffect } from "react";
import ModalDialog from "../../components/UI/modal/modal";
import Loading from "../../components/UI/loading/loading.js";
import HomePageCategories from "../../components/homePage/homepageCategories/homepageCategories.js";
import MostWatchProducts from "../../components/homePage/mostWatchProducts/mostWatchProducts.js";
import MostHotProducts from "../../components/homePage/mostHotProducts/mostHotProducts.js";

const HomePage = () => {
  const [productState, setProductState] = useState([]);
  const [categoriesState, setCategoriesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await getProducts();
        let productsArry = [];
        let categories = [];

        for (const [key, value] of Object.entries(products)) {
          if (value.categories) {
            productsArry.push({fbId : key, ...value})
            categories.push(value.categories);
          }
        }
        setProductState(productsArry);
        setCategoriesState([...new Set(categories)]);
      } catch (error) {
        setModal({
          show: true,
          title: "שגיאה",
          text: "שגיאה בהצגת נתונים, בדוק את חיבור האינטרנט",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const homePageComponents = () => {
    return (
      <div>
        <HomePageCategories categoriesState={categoriesState} />
        <MostWatchProducts productState={productState} />
        <MostHotProducts productState={productState}/>
      </div>
    );
  };

  return (
    <Aux>
      {modal.show && (
        <ModalDialog
          title={modal.title}
          text={modal.text}
          onModalClose={() => setModal({ show: false, title: "", text: "" })}
        />
      )}
      {!loading ? homePageComponents() : <Loading />}
    </Aux>
  );
};

export default HomePage;
