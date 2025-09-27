import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {

  return (
    <View className="bg-yellowPrimary flex-1">
      <Stack screenOptions={{
        headerShown: false,
        navigationBarHidden: true,

      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="customers" />
        <Stack.Screen name="customerPage" />

        <Stack.Screen name="debtsPage" />
        <Stack.Screen name="addDebtPage" />
        <Stack.Screen name="reportsPage" />
        <Stack.Screen name="monthReport" options={{
          headerShown: false,
          navigationBarHidden: true,
          animation: 'slide_from_bottom'
        }} />
        <Stack.Screen name="yearReport" options={{
          headerShown: false,
          navigationBarHidden: true,
          animation: 'slide_from_bottom'
        }} />
      </Stack>
    </View>
  )
}
