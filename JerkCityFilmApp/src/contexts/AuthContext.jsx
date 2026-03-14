import { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../modules/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stopProfileListener = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Clean up old listener if switching users or logging out
      if (stopProfileListener) {
        stopProfileListener();
        stopProfileListener = null;
      }

      if (currentUser) {
        const profileRef = ref(database, `users/${currentUser.uid}`);

        // Attach new listener
        stopProfileListener = onValue(profileRef, (snap) => {
          setProfile(snap.exists() ? snap.val() : null);
        });
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (stopProfileListener) stopProfileListener();
    };
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
