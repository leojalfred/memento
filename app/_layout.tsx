import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { EventProvider } from 'react-native-outside-press'
import '../global.css'

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <EventProvider>
        <Stack screenOptions={{ navigationBarHidden: true }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </EventProvider>
    </ThemeProvider>
  )
}
