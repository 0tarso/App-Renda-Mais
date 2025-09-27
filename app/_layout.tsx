import "../global.css"
import Toast, { BaseToast, BaseToastProps, ErrorToast, InfoToast } from 'react-native-toast-message';
import { JSX, useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from "expo-status-bar"
import * as SplashScreen from 'expo-splash-screen';

import 'react-native-reanimated';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

import { View } from 'react-native';
import { setCustomText, setCustomTextInput } from 'react-native-global-props';

import { CustomerProvider } from "@/contexts/CustomersProvider";
import { AuthProvider } from "@/contexts/AuthProvider";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true,
});


//desativa scaling em <Text> e <TextInput>
const customTextProps = {
  allowFontScaling: false,
};
const customTextInputProps = {
  allowFontScaling: false,
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const toastConfig = {

    info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <InfoToast
        {...props}
        style={{ borderLeftColor: 'blue', elevation: 2, height: 100 }}
        contentContainerStyle={{ paddingHorizontal: 15, }}
        text2NumberOfLines={3}
        text1Style={{
          fontSize: 25,
          fontWeight: '700',
        }}
        text2Style={{
          fontSize: 20,
          fontWeight: '400',
        }}

      />
    ),
    success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}

        style={{ borderLeftColor: 'green', elevation: 2, height: 100 }}
        contentContainerStyle={{ paddingHorizontal: 15, }}
        text2NumberOfLines={3}
        text1Style={{
          fontSize: 25,
          fontWeight: '700',
        }}
        text2Style={{
          fontSize: 20,
          fontWeight: '400',
        }}

      />
    ),
    error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <ErrorToast
        {...props}

        style={{ elevation: 2, height: 100 }}
        text2NumberOfLines={5}
        text1Style={{
          fontSize: 25
        }}
        text2Style={{
          fontSize: 20
        }}
      />
    ),

  }
    ;

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    UbuntuBold: require('../assets/fonts/Ubuntu-Bold.ttf'),
    UbuntuBoldItalic: require('../assets/fonts/Ubuntu-BoldItalic.ttf'),
    UbuntuItalic: require('../assets/fonts/Ubuntu-Italic.ttf'),
    UbuntuLight: require('../assets/fonts/Ubuntu-Light.ttf'),
    UbuntuLightItalic: require('../assets/fonts/Ubuntu-LightItalic.ttf'),
    UbuntuMedium: require('../assets/fonts/Ubuntu-Medium.ttf'),
    UbuntuRegular: require('../assets/fonts/Ubuntu-Regular.ttf'),
  });


  useEffect(() => {
    if (loaded) {
      console.log("Fontes Carregadas")
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    return null;
  }

  return (
    <View className="bg-yellowPrimary flex-1">
      <AuthProvider>
        <CustomerProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{

            }}
          >
            <Stack.Screen name="login" options={{
              headerShown: false,
              navigationBarHidden: false
            }} />
            <Stack.Screen name="(auth)" options={{
              headerShown: false,
              navigationBarHidden: true

            }} />
          </Stack>
          <Toast config={toastConfig} position="bottom" swipeable />
        </CustomerProvider>
      </AuthProvider>
    </View>
  )
}
