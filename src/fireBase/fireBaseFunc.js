import { auth, GoogleAuthProvider, signInWithPopup, db, onAuthStateChanged } from "./firebase";
import { onValue, ref, set, push, get, remove, child, update } from "firebase/database";

export const logout = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
};

export const getAllowedAdmins = async () => {
  const query = ref(db, "allowedAdmins");

  try {
    const snapshot = await get(query);
    const data = snapshot.val();
    return data;
  } catch (error) {
    console.error("Error getting allowed admins:", error);
    throw error;
  }
};

export const logInWithGoogle = async () => {
  try {
    const allowedAdmins = await getAllowedAdmins()
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if(allowedAdmins.includes(user.email)){
      const token = await user.getIdToken();
      return { user, token };
    }
    else{
      user.delete();
      throw new Error("משתמש זה לא יכול להתחבר כאדמין, במידה ואתה אחד האדמינים פנה למנהלי האתר"); 
    }
  } catch (error) {
    throw new Error("Google login failed. Check your internet or try again later.");
  }
};

export const initializeAuth = async() => {
  let userData = null;
  onAuthStateChanged(auth , (user) => {
    if (user) {
      userData = user;
    } else {
      return null;
    }
  });
  return userData;
}

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

export const getProductById = async productId => {
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
    const updatedCategories = categories ? [...(categories.categories || []), data] : [data];
    let filteredArray = updatedCategories.filter(element => element !== undefined);
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
    let filteredArray = updatedTypes.filter(element => element !== undefined);
    console.log(filteredArray);
    const productsRef = ref(db, "types");
    set(productsRef, filteredArray);
  } catch (error) {
    console.error("Error adding type to Firebase:", error);
  }
};

export const addProduct = async (data) => {
  try {
    const productData = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ...data
    };
    const productsRef = ref(db, "products");
    await push(productsRef, productData);
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

export const removeProduct = async productId => {
  try {
    const productsRef = ref(db, 'products');
    const productToRemoveRef = child(productsRef, productId);
    await remove(productToRemoveRef);
  } catch (error) {
    console.error('Error removing product from Firebase:', error);
  }
};