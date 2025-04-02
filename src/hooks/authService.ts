import { auth } from "../hooks/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../hooks/firebase";

export interface IUser {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
  displayName?: string;
}

export interface UserAuth {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  phoneNumber?: string;
}

export const signUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  if (!email || !password) return null;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    updateProfile(userCredential.user, {
      displayName: displayName,
    });

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    };
  } catch (error) {
    console.error("Signup error:", (error as Error).message);
    return null;
  }
};

export const login = async (email: string, password: string) => {
  if (!email || !password) return null;

  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", (error as Error).message);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", (error as Error).message);
  }
};

export const createUserDocumentFromAuth = async (
  userAuth: UserAuth,
  additionalInformation = {}
) => {
  if (!userAuth?.uid) return null;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        uid: userAuth.uid,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.error("Error creating user document:", (error as Error).message);
    }
  }

  return userDocRef;
};

export const getUserDocument = async (uid: string) => {
  if (!uid) return null;

  try {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.warn("User document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user document:", (error as Error).message);
    return null;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
