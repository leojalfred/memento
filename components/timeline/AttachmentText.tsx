import AnimatedGradient from '@/components/AnimatedGradient'
import type { AttachmentData } from '@/types'
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  type LayoutChangeEvent,
} from 'react-native'
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
  isEditing: boolean
  attachment: AttachmentData
  setStyles: React.Dispatch<React.SetStateAction<any>>
  children: React.ReactNode
}

const mediaWidth = 128
let padding = 4
let borderRadius = 8

const audioPlayerHeight = 28.3
const audioPlayerWidth = 172

export default function AttachmentText({
  className,
  animatedColors,
  animatedBackgroundColor,
  colorPair,
  isEditing,
  attachment,
  setStyles,
  children,
}: AttachmentTextProps) {
  function onLayout(event: LayoutChangeEvent) {
    if (isEditing) return

    const { width, height } = event.nativeEvent.layout

    if (['image', 'video'].includes(attachment.type)) {
      const scaledAttachmentHeight =
        (mediaWidth / attachment.width!) * attachment.height!

      const aspectRatio = attachment.width! / attachment.height!
      const top = (height - scaledAttachmentHeight) / 2 - padding
      const left = (width - mediaWidth) / 2 - padding + 5.25

      setStyles(
        StyleSheet.create({
          mediaContainer: {
            position: 'absolute',
            top,
            left,
            borderRadius: borderRadius + padding,
            padding,
          },
          media: {
            aspectRatio,
            width: mediaWidth,
            borderRadius,
          },
        }),
      )
    } else if (attachment.type === 'audio') {
      const top = (height - audioPlayerHeight) / 2 - padding
      const left = (width - audioPlayerWidth) / 2 + 5.25

      setStyles(
        StyleSheet.create({
          mediaContainer: {
            position: 'absolute',
            top,
            left,
            borderRadius: 100,
            paddingHorizontal: 16,
            paddingVertical: 8,
          },
        }),
      )
    }
  }

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
