import { createContext, useState, useEffect, ReactNode } from "react";
import { useIonLoading, useIonRouter } from "@ionic/react";
import { IUser, onAuthStateChangedListener } from "../hooks/authService";

interface UserContextType {
  currentUser: IUser | null;
  setCurrentUser: (user: IUser | null) => void;
  isAuthChecked: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loading, dismiss] = useIonLoading();
  const router = useIonRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      await loading();
      const unsubscribe = onAuthStateChangedListener((user) => {
        console.log("user: ", user);
        setCurrentUser(user);
        setIsAuthChecked(true);
        if (user) {
          router.push("/newsfeed", "root");
        } else {
          router.push("/login", "root");
        }
      });
      await dismiss();
      return unsubscribe;
    };

    const unsubscribe = checkAuthState();
    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, [loading, dismiss, router]);

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, isAuthChecked }}
    >
      {isAuthChecked ? children : null}
    </UserContext.Provider>
  );
};
