import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc,onSnapshot  } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function useUserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile]   = useState(null);
  const [error, setError]       = useState(null);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    async function fetchUser() {
      const user = auth.currentUser;
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const docRef = doc(db, "usuario", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  return { userData, loading };
}