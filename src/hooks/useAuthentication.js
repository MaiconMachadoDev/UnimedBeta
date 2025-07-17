import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  reauthenticateWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
 
} from "firebase/auth";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfIsCancelled() {
    if (cancelled) return;
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
      await updateProfile(user, { displayName: data.displayName });
      return user;
    } catch (error) {
      let systemErrorMessage;

      if (error.message.includes("Password")) {
        systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
    }
    setLoading(false);
  };

  const logout = () => {
    checkIfIsCancelled();
    signOut(auth);
  };

  const login = async (data) => {
    checkIfIsCancelled();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      let systemErrorMessage;

      if (error.message.includes("user-not-found")) {
        systemErrorMessage = "Usuário não encontrado.";
      } else if (error.message.includes("wrong-password")) {
        systemErrorMessage = "Senha incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
    }
    setLoading(false);
  };

  const sendVerification = async () => {
    checkIfIsCancelled();
    const user = auth.currentUser;
    if (!user) return;

    await reload(user);

    if (user.emailVerified) {
      alert("Seu e‑mail já está verificado ✔️");
      return;
    }

    try {
      await sendEmailVerification(user, {
        url: "https://maiconmachadodev.github.io/UnimedBeta/",
      });
      alert(`E‑mail de verificação enviado para ${user.email}.`);
    } catch (error) {
      console.error("Erro ao enviar verificação:", error);
      alert("Não foi possível enviar o e‑mail de verificação.");
    }
  };

  const sendPasswordReset = async (defaultEmail = "") => {
    const email = prompt("Digite seu e-mail:", defaultEmail);
    if (!email || !email.includes("@")) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de recuperação enviado com sucesso!");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("Nenhuma conta encontrada com esse e-mail.");
          break;
        case "auth/invalid-email":
          alert("O e-mail informado é inválido.");
          break;
        default:
          alert("Erro ao enviar e‑mail. Tente novamente.");
      }
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário autenticado com Google:", result.user);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Erro ao fazer login com Google.");
    }
    setLoading(false);
  };

  //atualizar o usuario
const updateUserName = async (displayName) => {
  checkIfIsCancelled();
  if (!displayName?.trim()) return;          // nada para fazer
  setLoading(true);
  setError(null);

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    // evita chamada desnecessária
    if (user.displayName?.trim() === displayName.trim()) return user;

    await updateProfile(user, { displayName: displayName.trim() });
    await user.reload();                     // garante sincronia local

    return auth.currentUser;                 // usuário já atualizado
  } catch (err) {
    console.error("Erro ao atualizar nome de usuário:", err);
    setError("Não foi possível atualizar o nome de usuário.");
    throw err;
  } finally {
    setLoading(false);
  }
};
    
// excluir conta

 const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  try {
    // Se for do Google, reautentica com popup
  
     
    await deleteUser(user);
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    throw error;
  }
};


  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    login,
    logout,
    sendVerification,
    sendPasswordReset,
    signInWithGoogle,
    updateUserName,
    deleteUserAccount,
    error,
    loading,
  };
};