import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

interface BarProps {
  delay: number
  isPlaying: boolean
  className?: string
}

const baselineHeight = 8
const duration = 400

function Bar({ delay, isPlaying, className }: BarProps) {
  const height = useSharedValue(baselineHeight)

  useEffect(() => {
    if (isPlaying) {
      height.value = withDelay(
        delay,
        withRepeat(
          withDelay(
            200,
            withSequence(
              withTiming(16, { duration }),
              withTiming(6, { duration }),
              withTiming(18, { duration }),
              withTiming(8, { duration }),
              withTiming(14, { duration }),
              withTiming(baselineHeight, { duration }),
            ),
          ),
          -1,
        ),
      )
    } else {
      height.value = withTiming(baselineHeight, { duration: 200 })
    }
  }, [height, delay, isPlaying])
  const animatedHeight = useAnimatedStyle(() => ({
    height: height.value,
  }))

  return (
    <Animated.View
      style={animatedHeight}
      className={twMerge(
        'h-2 w-px rounded-full bg-zinc-900 dark:bg-zinc-100',
        className,
      )}
    />
  )
}

interface WaveformProps {
  count: number
  isPlaying?: boolean
  className?: string
}

export default function Waveform({
  count,
  isPlaying,
  className,
}: WaveformProps) {
  const bars: React.ReactNode[] = []
  for (let i = 0; i < count; i++) {
    bars.push(
      <Bar
        key={i}
        className={className}
        delay={i * 100}
        isPlaying={isPlaying ?? true}
      />,
    )
  }

  return <View className="h-[18px] flex-row items-center gap-1">{bars}</View>
}
