import 'dotenv/config';

export default {
  expo: {
    name: "AppRendaMais",
    slug: "apprendamais",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "apprendamais",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    icon: "./assets/images/logo.png",
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#FFE55D"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      versionCode: 3,
      package: "com.app.rendamais",
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#FFE55D"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true
    },
    extra: {
      firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID
      }
    }
  }
};