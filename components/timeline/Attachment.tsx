import AnimatedGradient from '@/components/AnimatedGradient'
import IconButton from '@/components/IconButton'
import AttachmentText from '@/components/timeline/AttachmentText'
import { colors } from '@/constants/colors'
import type { AttachmentData } from '@/types'
import { Audio, Video } from 'expo-av'
import { Image } from 'expo-image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { BarIndicator } from 'react-native-indicators'
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

interface AttachmentProps {
  i: number
  value: string
  attachment: AttachmentData
  sortedAttachments: AttachmentData[]
  isEditing: boolean
}

const width = 128
const padding = 4
const borderRadius = 8

export default function Attachment({
  i,
  value,
  attachment,
  sortedAttachments,
  isEditing,
}: AttachmentProps) {
  const attachmentStartsInWord = value[attachment.start - 1] !== ' '
  const attachmentStartsAtStart = attachment.start === 0
  const attachmentEndsAtEnd = attachment.end === value.length
  const attachmentEndsInWord = value[attachment.end] !== ' '
  const attachmentHasAttachmentAsNextWord =
    i !== sortedAttachments.length - 1 &&
    attachment.end + 1 === sortedAttachments[i + 1].start
  const classes = twMerge(
    attachmentStartsInWord && 'ml-0',
    attachmentStartsAtStart && '-ml-1',
    (attachmentEndsAtEnd ||
      attachmentEndsInWord ||
      attachmentHasAttachmentAsNextWord) &&
      '-mr-2.5',
  )

  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [progress])
  const animatedColors = useAnimatedProps(() => ({
    colors: [
      interpolateColor(progress.value, [0, 1], attachment.colorPair),
      interpolateColor(
        progress.value,
        [0, 1],
        attachment.colorPair.toReversed(),
      ),
    ],
  }))
  const animatedBackgroundColor = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      attachment.colorPair,
    ),
  }))

  const [textWidth, setTextWidth] = useState<number>()
  const text = value.slice(attachment.start, attachment.end)
  let aspectRatio = null
  let top = null
  let left = null

  if (['image', 'video'].includes(attachment.type)) {
    aspectRatio = attachment.width! / attachment.height!
    top =
      -((width / attachment.width!) * attachment.height! * 0.5) + 8.5 - padding
    left = textWidth ? -width / 2 + textWidth / 2 + 5.25 - padding : undefined
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        mediaContainer: {
          position: 'absolute',
          top,
          left,
          borderRadius: borderRadius + padding,
          padding,
        },
      }),
    [top, left],
  )

  const [isPlaying, setIsPlaying] = useState(false)
  const soundRef = useRef<Audio.Sound | null>(null)

  useEffect(() => {
    if (attachment.type === 'audio') {
      const loadSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
          { uri: attachment.uri },
          { isLooping: true }, // Set isLooping to true
        )
        soundRef.current = sound
        if (!isEditing) {
          await sound.playAsync()
          setIsPlaying(true)
        }
      }
      loadSound()

      return () => {
        if (soundRef.current) {
          soundRef.current.unloadAsync()
        }
      }
    }
  }, [attachment.type, attachment.uri, isEditing])

  useEffect(() => {
    if (isEditing && isPlaying) {
      soundRef.current?.pauseAsync()
      setIsPlaying(false)
    }
  }, [isEditing, isPlaying])

  const togglePlayPause = async () => {
    if (isPlaying) {
      await soundRef.current?.pauseAsync() // Change stopAsync to pauseAsync
      setIsPlaying(false)
    } else {
      await soundRef.current?.playAsync()
      setIsPlaying(true)
    }
  }

  let media
  if (attachment.type === 'image') {
    media = (
      <Image
        source={{ uri: attachment.uri }}
        alt={text}
        style={{
          aspectRatio: aspectRatio!,
          width,
          borderRadius,
        }}
      />
    )
  } else if (attachment.type === 'video') {
    media = (
      <Video
        source={{ uri: attachment.uri }}
        style={{
          aspectRatio: aspectRatio!,
          width,
          borderRadius,
        }}
        shouldPlay={!isEditing}
        isLooping
      />
    )
  } else if (attachment.type === 'audio') {
    media = (
      <View className="h-12 w-32 flex-row items-center justify-between">
        <IconButton
          icon={isPlaying ? 'stop-circle' : 'play-circle'}
          onPress={togglePlayPause}
          disabled={isEditing}
        />
        <View className="w-20">
          <BarIndicator
            animationDuration={900}
            color={colors.white}
            count={16}
            size={12}
          />
        </View>
      </View>
    )
  }

  return (
    <View key={`attachment-${i}`}>
      <AttachmentText
        className={classes}
        animatedColors={animatedColors}
        animatedBackgroundColor={animatedBackgroundColor}
        colorPair={attachment.colorPair}
        setTextWidth={setTextWidth}
      >
        {text.split(/(\p{Emoji_Presentation})/u).map((part, j) =>
          part.match(/\p{Emoji_Presentation}/u) ? (
            <Text key={`emoji-${i}-${j}`} className="text-[0.75rem]">
              {part}
            </Text>
          ) : (
            part
          ),
        )}
      </AttachmentText>
      {Platform.OS === 'ios' ? (
        <AnimatedGradient
          animatedProps={animatedColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={attachment.colorPair}
          style={[
            styles.mediaContainer,
            attachment.type === 'audio' && {
              top: -30,
              left: textWidth ? -64 + textWidth / 2 : undefined,
            },
          ]}
        >
          {media}
        </AnimatedGradient>
      ) : (
        <Animated.View
          style={[
            animatedBackgroundColor,
            styles.mediaContainer,
            attachment.type === 'audio' && {
              top: -30,
              left: textWidth ? -64 + textWidth / 2 : undefined,
            },
          ]}
        >
          {media}
        </Animated.View>
      )}
    </View>
  )
}
