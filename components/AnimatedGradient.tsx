import { LinearGradient } from 'expo-linear-gradient'
import { cssInterop } from 'nativewind'
import Animated from 'react-native-reanimated'

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
})
export default Animated.createAnimatedComponent(LinearGradient)
