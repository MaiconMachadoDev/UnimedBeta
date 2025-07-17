import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export const useUserPhone = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const unsub = onSnapshot(doc(db, "users", uid), (docSnap) => {
      if (docSnap.exists()) {
        setPhone(docSnap.data().phone || "");
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  const savePhone = async (newPhone) => {
    if (!uid) throw new Error("Usuário não autenticado.");
    await setDoc(doc(db, "users", uid), { phone: newPhone }, { merge: true });
    setPhone(newPhone);
  };

  return { phone, setPhone, savePhone, loading, error };
};