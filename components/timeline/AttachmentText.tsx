import AnimatedGradient from '@/components/AnimatedGradient'
import { Platform, Text, type LayoutRectangle } from 'react-native'
import Animated from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

interface AttachmentTextProps {
  className?: string
  animatedColors: Partial<{
    colors: string[]
  }>
  animatedBackgroundColor: {
    backgroundColor: string
  }
  colorPair: [string, string]
  setAttachmentTextLayout: React.Dispatch<
    React.SetStateAction<LayoutRectangle | undefined>
  >
  children: React.ReactNode
}

export default function AttachmentText({
  className,
  animatedColors,
  animatedBackgroundColor,
  colorPair,
  setAttachmentTextLayout,
  children,
}: AttachmentTextProps) {
  return Platform.OS === 'ios' ? (
    <AnimatedGradient
      animatedProps={animatedColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={twMerge('-mr-1 ml-1.5 rounded-sm px-1', className)}
      colors={colorPair}
      onLayout={(event) => setAttachmentTextLayout(event.nativeEvent.layout)}
    >
      <Text className="font-cp leading-[1.3125] text-white">{children}</Text>
    </AnimatedGradient>
  ) : (
    <Animated.View
      style={animatedBackgroundColor}
      className={twMerge('-mr-1 ml-1.5 rounded-sm px-1', className)}
      onLayout={(event) => setAttachmentTextLayout(event.nativeEvent.layout)}
    >
      <Text className="font-cp leading-[1.3125] text-white">{children}</Text>
    </Animated.View>
  )
}
