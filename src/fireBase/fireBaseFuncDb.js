import { auth, db } from "./firebase";
import {
  onValue,
  ref,
  set,
  push,
  get,
  remove,
  child,
  update,
} from "firebase/database";
import { deleteImgs } from "./fireBaseStorage";

export const getCategories = async () => {
  const query = ref(db, "categories");
  return new Promise((resolve, reject) => {
    onValue(
      query,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      {
        onlyOnce: true,
      }
    );
  });
};

export const getTypes = async () => {
  const query = ref(db, "types");
  return new Promise((resolve, reject) => {
    onValue(
      query,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      {
        onlyOnce: true,
      }
    );
  });
};

export const getProducts = async () => {
  const query = ref(db, "products");
  return new Promise((resolve, reject) => {
    onValue(
      query,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      {
        onlyOnce: true,
      }
    );
  });
};

export const deleteCategory = async (category) => {
  try {
    const categories = await getCategories();

    const updatedCategories = categories
      ? categories.categories.filter((categoryEle) => categoryEle !== category)
      : [];
    const types = await getTypes();
    const updatedTypes = types
      ? types.filter((type) => type.category !== category)
      : [];

    const categoriesRef = ref(db, "categories");
    set(categoriesRef, { categories: updatedCategories });

    const typesRef = ref(db, "types");
    set(typesRef, updatedTypes);
    return updatedCategories;
  } catch (error) {
    console.error("Error deleting category from Firebase:", error);
  }
};

export const getProductById = async (productId) => {
  const query = ref(db, `products/${productId}`);
  return new Promise((resolve, reject) => {
    onValue(
      query,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      {
        onlyOnce: true,
      }
    );
  });
};

export const addCategory = async (data) => {
  try {
    const categories = await getCategories();
    const updatedCategories = categories
      ? [...(categories.categories || []), data]
      : [data];
    let filteredArray = updatedCategories.filter(
      (element) => element !== undefined
    );
    const productsRef = ref(db, "categories");
    set(productsRef, { categories: filteredArray });
  } catch (error) {
    console.error("Error adding category to Firebase:", error);
  }
};

export const addType = async (data) => {
  try {
    const types = await getTypes();
    const updatedTypes = types ? [...types, data] : [data];
    let filteredArray = updatedTypes.filter((element) => element !== undefined);
    const productsRef = ref(db, "types");
    set(productsRef, filteredArray);
  } catch (error) {
    console.error("Error adding type to Firebase:", error);
  }
};

export const deleteType = async (typeObject) => {
  try {
    const types = await getTypes();

    const typesArr = [...types.filter((type) => type.type !== typeObject.type)];
    console.log(typesArr);
    const typesRef = ref(db, "types");
    set(typesRef, typesArr);
    return typesArr;
  } catch (error) {
    console.error("Error deleting type from Firebase:", error);
  }
};

export const addProduct = async (data) => {
  try {
    const productData = {
      ...data,
    };
    const productsRef = ref(db, "products");
    await push(productsRef, productData);
    return productData;
  } catch (error) {
    console.error("Error adding product to Firebase:", error);
  }
};

export const editProduct = async (productId, data) => {
  try {
    const productsRef = ref(db, "products");
    const productSnapshot = await get(child(productsRef, productId));

    if (productSnapshot.exists()) {
      // If the product with the given ID exists, update its data
      await update(child(productsRef, productId), data);
    } else {
      console.error("Product not found for editing");
    }
  } catch (error) {
    console.error("Error editing product in Firebase:", error);
  }
};

export const removeProduct = async (productId, imgId) => {
  try {
    const productsRef = ref(db, "products");
    const productToRemoveRef = child(productsRef, productId);
    await remove(productToRemoveRef);
    await deleteImgs(imgId);
  } catch (error) {
    console.error("Error removing product from Firebase:", error);
  }
};

export const addVisit = async () => {
  let admin = auth.currentUser;
  if (admin === null) {
    let visitDate = new Date().toLocaleString();
    let visit = {
      visitId:
        Math.floor(Math.random() * 1000000) *
        Math.floor(Math.random() * 1000000),
      createdAt: visitDate,
    };
    try {
      const visitRef = ref(db, "visits");
      await push(visitRef, visit);
      return visit;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getVisits = async () => {
  const query = ref(db, "visits");
  return new Promise((resolve, reject) => {
    onValue(
      query,
      (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      },
      {
        onlyOnce: true,
      }
    );
  });
};
