import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendEmailVerification,
  reload ,
  sendPasswordResetEmail
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfIsCancelled() {
    if (cancelled) {
      return;
    }
  }

  const createUser = async (data) => {
    checkIfIsCancelled();

    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, {
        displayName: data.displayName,
      });

      return user;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage;

      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
      }

      setError(systemErrorMessage);
    }

    setLoading(false);
  };

 //logout singout
  const logout = () => {
    checkIfIsCancelled();

    signOut(auth);
  };
  // loging
  const login = async (data) => {
    checkIfIsCancelled();

    setLoading(true);
    setError(false);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);
      console.log(error.message.includes("user-not"));

      let systemErrorMessage;

      if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Usuário não encontrado.";
      } else if (error.message.includes("wrong-password")) {
        systemErrorMessage = "Senha incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
      }

      console.log(systemErrorMessage);

      setError(systemErrorMessage);
    }

    console.log(error);

    setLoading(false);
  };
  const actionCodeSettings = {
  url: "https://maiconmachadodev.github.io/UnimedBeta/", 
};
  const sendVerification = async () => {
    checkIfIsCancelled();

    const user = auth.currentUser;
    if (!user) return;

    // 1️⃣ Atualiza os dados do usuário para ter o status real
    await reload(user);

    // 2️⃣ Se já verificado, não envia de novo
    if (user.emailVerified) {
      alert("Seu e‑mail já está verificado ✔️");
      return;
    }

    // 3️⃣ Caso contrário, envia o e‑mail
    try {
      await sendEmailVerification(user,actionCodeSettings);
      alert(`E‑mail de verificação enviado para ${user.email}. Confira sua caixa de entrada.`);
    } catch (error) {
      console.error("Erro ao enviar e‑mail de verificação:", error);
      alert("Não foi possível enviar o e‑mail de verificação.");
    }
  };

  async function sendPasswordReset(defaultEmail = "") {
  const email = prompt("Digite seu e-mail para recuperar a senha:", defaultEmail);

  if (!email || !email.includes("@")) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    alert("E-mail de recuperação enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar e-mail de recuperação:", error);

    // Mensagens de erro mais amigáveis
    switch (error.code) {
      case "auth/user-not-found":
        alert("Nenhuma conta encontrada com esse e-mail.");
        break;
      case "auth/invalid-email":
        alert("O e-mail informado é inválido.");
        break;
      default:
        alert("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
    }
  }
}

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    logout,
    login,
    loading,
    sendVerification,
    sendPasswordReset
  };

};