import { LinearGradient } from 'expo-linear-gradient'
import { cssInterop } from 'nativewind'
import { useEffect } from 'react'
import { Platform, Text } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

interface AttachmentTextProps {
  className?: string
  colorPair: [string, string]
  setTextWidth: React.Dispatch<React.SetStateAction<number | undefined>>
  children: React.ReactNode
}

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
})
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

export default function AttachmentText({
  className,
  colorPair,
  setTextWidth,
  children,
}: AttachmentTextProps) {
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [progress])

  const animatedColors = useAnimatedProps(() => ({
    colors: [
      interpolateColor(progress.value, [0, 1], colorPair),
      interpolateColor(progress.value, [0, 1], colorPair.toReversed()),
    ],
  }))
  const animatedBackgroundColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], colorPair),
  }))

  return Platform.OS === 'ios' ? (
    <AnimatedLinearGradient
      animatedProps={animatedColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={twMerge('-mr-1 ml-1.5 rounded-sm px-1', className)}
      colors={colorPair}
      onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
    >
      <Text className="font-cp leading-[1.3125] text-white">{children}</Text>
    </AnimatedLinearGradient>
  ) : (
    <Animated.View
      style={animatedBackgroundColor}
      className={twMerge('-mr-1 ml-1.5 rounded-sm px-1', className)}
      onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
    >
      <Text className="font-cp leading-[1.3125] text-white">{children}</Text>
    </Animated.View>
  )
}
