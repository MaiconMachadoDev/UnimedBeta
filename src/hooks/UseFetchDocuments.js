import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";

export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const normalize = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      setLoading(true);

      const collectionRef = collection(db, docCollection);
      let q;

      try {
        // Busca geral, filtrando por UID se fornecido
        if (uid) {
          q = query(collectionRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
        } else {
          q = query(collectionRef, orderBy("createdAt", "desc"));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          let results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Busca local nos campos nome, cirurgia e médico
          if (search) {
            const normalizedSearch = normalize(search);
            results = results.filter((doc) =>
              normalize(doc.nome || "").includes(normalizedSearch) ||
              normalize(doc.cirurgia || "").includes(normalizedSearch) ||
              normalize(doc.medico || "").includes(normalizedSearch)
            );
          }

          setDocuments(results);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.log(err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadData();
  }, [docCollection, search, uid, cancelled]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { documents, loading, error };
};