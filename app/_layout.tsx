import {
  CourierPrime_400Regular,
  CourierPrime_700Bold,
  useFonts,
} from '@expo-google-fonts/courier-prime'
import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import '../global.css'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    cp: CourierPrime_400Regular,
    'cp-bold': CourierPrime_700Bold,
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ navigationBarHidden: true }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  )
}
