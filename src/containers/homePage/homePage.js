import Aux from "../../hoc/Auxiliary/Auxiliary.js";
import { getProducts } from "../../fireBase/fireBaseFuncDb";
import { useState, useEffect } from "react";
import ModalDialog from "../../components/UI/modal/modal";
import Loading from "../../components/UI/loading/loading.js";
import HomePageCategories from "../../components/homepageCategories/homepageCategories.js";

const HomePage = () => {
  const [categoriesState, setCategoriesState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, title: "", text: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const products = await getProducts();
        let categories = [];

        for (const [, value] of Object.entries(products)) {
          if (value.categories) {
            categories.push(value.categories);
          }
        }

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
    return <HomePageCategories categoriesState={categoriesState} />;
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
