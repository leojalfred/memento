import { Platform, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Memento</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.select({
      android: 'CourierPrime_400Regular',
      ios: 'CourierPrime-Regular',
    }),
  },
})
