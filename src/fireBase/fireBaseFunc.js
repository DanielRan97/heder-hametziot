import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  db,
  onAuthStateChanged,
} from "./firebase";
import { ref, get } from "firebase/database";

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
    const allowedAdmins = await getAllowedAdmins();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (allowedAdmins.includes(user.email)) {
      const token = await user.getIdToken();
      return { user, token };
    } else {
      throw new Error(
        "משתמש זה לא יכול להתחבר כאדמין, במידה ואתה אחד האדמינים פנה למנהלי האתר"
      );
    }
  } catch (error) {
    throw new Error(
      "Google login failed. Check your internet or try again later."
    );
  }
};

export const initializeAuth = async () => {
  let userData = null;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userData = user;
    } else {
      return null;
    }
  });
  return userData;
};
