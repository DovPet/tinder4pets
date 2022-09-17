import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut
} from "@firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext({});

const config = {
  androidClientId:
    "798263319209-sfd10o60p6vd4tiuci7d792kcm6d2gb2.apps.googleusercontent.com",
  iosClientId:
    "798263319209-23jodpquohsqcm6lg8hi4hgbl9hgn8r7.apps.googleusercontent.com",
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"]
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoadingInitial(false);
    });
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    await Google.logInAsync(config)
      .then(async (loginResult) => {
        if (loginResult.type === "success") {
          const { idToken, accessToken } = loginResult;
          const credentials = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );

          await signInWithCredential(auth, credentials);
        }

        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  const logout = () => {
    setIsLoading(true);

    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false));
  };

  const memoValue = useMemo(
    () => ({
      user,
      isLoading,
      error,
      signInWithGoogle,
      logout
    }),
    [user, isLoading, error]
  );

  return (
    <AuthContext.Provider value={memoValue}>
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
