import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import Constants from 'expo-constants'

const firebaseConfig = Constants.expoConfig?.extra?.firebaseConfig || {};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

console.log('Firebase App Initialized:', app.name);
console.log('Firebase Auth Initialized:', auth);


export { app, auth, db }