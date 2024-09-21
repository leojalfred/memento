import AnimatedGradient from '@/components/AnimatedGradient'
import AttachmentAudio from '@/components/timeline/AttachmentAudio'
import type { AttachmentData } from '@/types'
import { Audio, ResizeMode, Video } from 'expo-av'
import { Image, ImageStyle } from 'expo-image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  LayoutChangeEvent,
  Platform,
  useWindowDimensions,
  ViewStyle,
} from 'react-native'
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface AttachmentMediaStyles {
  mediaContainer: ViewStyle
  media?: ImageStyle
}

interface AttachmentMediaProps {
  attachment: AttachmentData
  isEditing: boolean
  styles?: AttachmentMediaStyles
  text: string
  animatedColors: Partial<{
    colors: string[]
  }>
  animatedBackgroundColor: {
    backgroundColor: string
  }
  scrollY: SharedValue<number>
}

export default function AttachmentMedia({
  attachment,
  isEditing,
  styles,
  text,
  animatedColors,
  animatedBackgroundColor,
  scrollY,
}: AttachmentMediaProps) {
  const [mediaContainerY, setMediaContainerY] = useState(0)
  const measureView = useCallback(
    (event: LayoutChangeEvent) =>
      event.target.measure((x, y, width, height, pageX, pageY) => {
        setMediaContainerY(scrollY.value + pageY + height / 2)
      }),
    [scrollY.value],
  )

  const [sound, setSound] = useState<Audio.Sound>()
  const loadSound = useCallback(async () => {
    const status = await sound?.getStatusAsync()
    if (status?.isLoaded) return

    const { sound: loadedSound } = await Audio.Sound.createAsync(
      { uri: attachment.uri },
      { isLooping: true },
    )

    setSound(loadedSound)
  }, [sound, attachment.uri])

  // load sound
  useEffect(() => {
    if (attachment.type === 'audio') {
      loadSound()
    }
  }, [attachment.type, loadSound])

  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const visibleScreenHeight = height - insets.top - insets.bottom
  const [isVisible, setIsVisible] = useState(false)

  const opacity = useSharedValue(0)
  useAnimatedReaction(
    () => scrollY.value,
    (scrollPosition) => {
      const middleScreenStart = scrollPosition + visibleScreenHeight * 0.4
      const middleScreenEnd = scrollPosition + visibleScreenHeight * 0.6

      if (
        mediaContainerY >= middleScreenStart &&
        mediaContainerY <= middleScreenEnd
      ) {
        opacity.value = withTiming(1, { duration: 200 })
        runOnJS(setIsVisible)(true)
      } else {
        opacity.value = withTiming(0, { duration: 200 })
        runOnJS(setIsVisible)(false)
      }
    },
    [scrollY, visibleScreenHeight, mediaContainerY],
  )
  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const media = useMemo(() => {
    if (!styles) return null

    if (attachment.type === 'image') {
      return (
        <Image
          source={{ uri: attachment.uri }}
          alt={text}
          style={styles.media}
        />
      )
    } else if (attachment.type === 'video') {
      return (
        <Video
          source={{ uri: attachment.uri }}
          style={styles.media}
          shouldPlay={isVisible && !isEditing}
          isLooping
          resizeMode={ResizeMode.CONTAIN}
        />
      )
    } else if (attachment.type === 'audio') {
      return <AttachmentAudio sound={sound} isEditing={isEditing} />
    }
  }, [
    attachment.type,
    attachment.uri,
    isVisible,
    isEditing,
    styles,
    text,
    sound,
  ])

  return (
    media && (
      <>
        {Platform.OS === 'ios' ? (
          <AnimatedGradient
            animatedProps={animatedColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={attachment.colorPair}
            style={[styles?.mediaContainer, animatedOpacityStyle]}
            onLayout={measureView}
          >
            {media}
          </AnimatedGradient>
        ) : (
          <Animated.View
            style={[
              styles?.mediaContainer,
              animatedBackgroundColor,
              animatedOpacityStyle,
            ]}
            onLayout={measureView}
          >
            {media}
          </Animated.View>
        )}
      </>
    )
  )
}
