import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import '../global.css'

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ navigationBarHidden: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  )
}
