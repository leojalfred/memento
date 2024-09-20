import AnimatedGradient from '@/components/AnimatedGradient'
import AttachmentAudio from '@/components/timeline/AttachmentAudio'
import type { AttachmentData } from '@/types'
import { Audio, ResizeMode, Video } from 'expo-av'
import { Image, ImageStyle } from 'expo-image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'

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
}

export default function AttachmentMedia({
  attachment,
  isEditing,
  styles,
  text,
  animatedColors,
  animatedBackgroundColor,
}: AttachmentMediaProps) {
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
          shouldPlay={!isEditing}
          isLooping
          resizeMode={ResizeMode.CONTAIN}
        />
      )
    } else if (attachment.type === 'audio') {
      return <AttachmentAudio sound={sound} isEditing={isEditing} />
    }
  }, [attachment.type, attachment.uri, isEditing, styles, text, sound])

  return (
    media && (
      <>
        {Platform.OS === 'ios' ? (
          <AnimatedGradient
            animatedProps={animatedColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={attachment.colorPair}
            style={[styles?.mediaContainer]}
          >
            {media}
          </AnimatedGradient>
        ) : (
          <Animated.View
            style={[animatedBackgroundColor, styles?.mediaContainer]}
          >
            {media}
          </Animated.View>
        )}
      </>
    )
  )
}
