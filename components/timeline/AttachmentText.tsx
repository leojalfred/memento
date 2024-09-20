import AnimatedGradient from '@/components/AnimatedGradient'
import React from 'react'
import { Platform, Text, type LayoutChangeEvent } from 'react-native'
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
  onLayout: (event: LayoutChangeEvent) => void
  children: React.ReactNode
}

export default function AttachmentText({
  className,
  animatedColors,
  animatedBackgroundColor,
  colorPair,
  onLayout,
  children,
}: AttachmentTextProps) {
  return Platform.OS === 'ios' ? (
    <AnimatedGradient
      animatedProps={animatedColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={twMerge('-mr-1 ml-1.5 rounded-sm px-1', className)}
      colors={colorPair}
      onLayout={onLayout}
    >
      <Text className="font-cp leading-[1.3125] text-white">{children}</Text>
    </AnimatedGradient>
  ) : (
    <Animated.View
      style={animatedBackgroundColor}
      className={twMerge('-mr-1 ml-1.5 rounded-sm px-1', className)}
      onLayout={onLayout}
    >
      <Text className="font-cp leading-[1.3125] text-white">{children}</Text>
    </Animated.View>
  )
}
