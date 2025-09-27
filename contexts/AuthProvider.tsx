import { auth } from "@/services/firebase/firebaseConnection"
import { logGenerate } from "@/utils/logGenerate"
import { router } from "expo-router"
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"


type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  handleSignUp: (email: string, password: string, name: string) => void
  handleSignIn: (email: string, password: string) => void
  handleSignOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)



  useEffect(() => {
    console.log('loading -->> ', loading)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      logGenerate('AuthContext.tsx', [`UserPersistence -->> ${user?.email}`])
      setLoading(false);

      if (user) {
        router.replace('/(auth)')
        setLoading(false)
      }
      else {
        router.replace('/login')
        setLoading(false)
        console.log("Sem usuario")
      }

      setLoading(false)
    });

    return unsubscribe;
  }, []);


  // Função de registro
  const handleSignUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user

      await updateProfile(user, { displayName: name })

      logGenerate('AuhtContext --> HandleSignUp', [
        `User: ${user.displayName}`,
        `Email: ${user.email}`,
      ])

      setUser(user);

      // router.navigate('/(auth)')


    } catch (err: any) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };


  // Função de login
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      // router.replace('/(auth)/index')

    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos');
      }

      logGenerate('AuthContext --> handleSignIn', [err.code]);

    } finally {
      setLoading(false);
    }

  };


  // Função de logout
  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      setUser(null);
      router.replace('/login')
      logGenerate('AuthContext', ['User Logout --->> Succesfull'])

    } catch (err: any) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleSignIn, handleSignOut, handleSignUp, error }}>
      {children}
    </AuthContext.Provider>
  );


}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}