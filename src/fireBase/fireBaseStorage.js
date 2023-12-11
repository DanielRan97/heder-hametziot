import { storage } from "./firebase";

import {
  ref as imgRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";

export const handleUploadImgs = async (files, id) => {
  let imgsUrlsArry = [];

  try {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const storageRef = imgRef(
        storage,
        `/hederHametziotProductImgs/${id}/place${index}`
      );

      await uploadBytes(storageRef, file);
      // Gets the URL for the uploaded image
      const imageUrl = await getDownloadURL(
        imgRef(storage, `/hederHametziotProductImgs/${id}/place${index}`)
      );
      imgsUrlsArry.push(imageUrl);
    }
    return imgsUrlsArry;
  } catch (error) {
    console.error("Error uploading files:", error.message);
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
      const storageRef = imgRef(
        storage,
        `/hederHametziotProductImgs/${id}/place${index}`
      );

      await uploadBytes(storageRef, file);

      // Gets the URL for the uploaded image
      const imageUrl = await getDownloadURL(
        imgRef(storage, `/hederHametziotProductImgs/${id}/place${index}`)
      );
      imgsUrlsArry.push(imageUrl);
    }

    return imgsUrlsArry;
  } catch (error) {
    console.error("Error editing files:", error.message);
    throw error; // You may want to handle the error appropriately in the calling code
  }
};

// Helper function to delete existing images for the given id
export const deleteImgs = async (id) => {
  try {
    let index = 0;

    while (true) {
      const imgPath = `/hederHametziotProductImgs/${id}/place${index}`;
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
    console.error("Error deleting existing files:", error.message);
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
    if (error.code !== "storage/object-not-found") {
      throw error;
    }
    return false;
  }
};
