import { auth, GoogleAuthProvider, signInWithPopup, db, onAuthStateChanged, storage } from "./firebase";
import { onValue, ref, set, push, get, remove, child, update } from "firebase/database";
import { ref as imgRef, uploadBytes, getDownloadURL, deleteObject, getMetadata } from "firebase/storage";


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
    const productsRef = ref(db, "types");
    set(productsRef, filteredArray);
  } catch (error) {
    console.error("Error adding type to Firebase:", error);
  }
};

export const addProduct = async (data) => {
  try {
    const productData = {
      ...data
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
    const productsRef = ref(db, 'products');
    const productToRemoveRef = child(productsRef, productId);
    await remove(productToRemoveRef);
    await deleteImgs(imgId);
  } catch (error) {
    console.error('Error removing product from Firebase:', error);
  }
};

export const handleUploadImgs = async (files, id) => {
  let imgsUrlsArry = [];

  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const storageRef = imgRef(storage, `/hederHametziotProductImgs/${id}/place${index}.jpg`);

      await uploadBytes(storageRef, file);
      // Gets the URL for the uploaded image
      const imageUrl = await getDownloadURL(imgRef(storage, `/hederHametziotProductImgs/${id}/place${index}.jpg`));
      imgsUrlsArry.push(imageUrl);
    }
    return imgsUrlsArry;
  } catch (error) {
    console.error('Error uploading files:', error.message);
    throw error; // You may want to handle the error appropriately in the calling code
  }
};

export const handleEditImgs = async (files, id) => {
  let imgsUrlsArry = [];

  try {
    // Delete existing images in the storage for the given id
    await deleteImgs(id);

    // Upload new images
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const storageRef = imgRef(storage, `/hederHametziotProductImgs/${id}/place${index}.jpg`);

      await uploadBytes(storageRef, file);

      // Gets the URL for the uploaded image
      const imageUrl = await getDownloadURL(
        imgRef(storage, `/hederHametziotProductImgs/${id}/place${index}.jpg`)
      );
      imgsUrlsArry.push(imageUrl);
    }

    return imgsUrlsArry;
  } catch (error) {
    console.error('Error editing files:', error.message);
    throw error; // You may want to handle the error appropriately in the calling code
  }
};

// Helper function to delete existing images for the given id
const deleteImgs = async (id) => {
  try {
    let index = 0;

    while (true) {
      const imgPath = `/hederHametziotProductImgs/${id}/place${index}.jpg`;
      const storageRef = imgRef(storage, imgPath);

      // Check if the image exists before trying to delete
      const exists = await refExists(storageRef);

      if (exists) {
        await deleteObject(storageRef);
      } else {
        // No more images, break out of the loop
        break;
      }

      index++;
    }
  } catch (error) {
    console.error('Error deleting existing files:', error.message);
    throw error;
  }
};

// Helper function to check if a reference exists in storage
const refExists = async (ref) => {
  try {
    await getMetadata(ref);
    return true;
  } catch (error) {
    // If the error is not "not found," then rethrow
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
    return false;
  }
};