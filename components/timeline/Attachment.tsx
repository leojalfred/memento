import AnimatedGradient from '@/components/AnimatedGradient'
import IconButton from '@/components/IconButton'
import AttachmentText from '@/components/timeline/AttachmentText'
import Waveform from '@/components/Waveform'
import type { AttachmentData } from '@/types'
import { Audio, Video } from 'expo-av'
import { Image } from 'expo-image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutRectangle, Platform, StyleSheet, Text, View } from 'react-native'
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
let padding = 4
let borderRadius = 8

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

  const [attachmentTextLayout, setAttachmentTextLayout] =
    useState<LayoutRectangle>()
  const text = value.slice(attachment.start, attachment.end)
  let aspectRatio = null
  let top = -9.075 // -36.3 [height] / 4 = -9.075
  let left = attachment.start === 0 ? -5.25 : 0

  if (['image', 'video'].includes(attachment.type) && attachmentTextLayout) {
    const scaledAttachmentHeight =
      (width / attachment.width!) * attachment.height!

    aspectRatio = attachment.width! / attachment.height!
    top = (attachmentTextLayout.height - scaledAttachmentHeight) / 2 - padding
    left = (attachmentTextLayout.width - width) / 2 - padding + 5.25
  }

  const styles = useMemo(() => {
    return attachment.type === 'audio'
      ? StyleSheet.create({
          mediaContainer: {
            position: 'absolute',
            top,
            left,
            borderRadius: 100,
            paddingHorizontal: 16,
            paddingVertical: 8,
          },
        })
      : StyleSheet.create({
          mediaContainer: {
            position: 'absolute',
            top,
            left,
            borderRadius: borderRadius + padding,
            padding,
          },
        })
  }, [attachment.type, top, left])

  const [sound, setSound] = useState<Audio.Sound>()
  const [isSoundPlaying, setIsSoundPlaying] = useState(false)
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

  // pause sound on edit
  useEffect(() => {
    if (sound) {
      if (isEditing) {
        sound.pauseAsync()
        setIsSoundPlaying(false)
      }
    }
  }, [sound, isEditing])

  // unload sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  async function toggleSoundPlayback() {
    if (isSoundPlaying) {
      await sound?.pauseAsync()
      setIsSoundPlaying(false)
    } else {
      await sound?.playAsync()
      setIsSoundPlaying(true)
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
      <View className="w-[140px] flex-row items-center justify-between">
        <IconButton
          className="pr-4"
          icon={isSoundPlaying ? 'stop-circle' : 'play-circle'}
          onPress={toggleSoundPlayback}
          disabled={isEditing}
        />
        <Waveform count={24} isPlaying={isSoundPlaying} />
      </View>
    )
  }

  return (
    <View>
      <AttachmentText
        className={classes}
        animatedColors={animatedColors}
        animatedBackgroundColor={animatedBackgroundColor}
        colorPair={attachment.colorPair}
        setAttachmentTextLayout={setAttachmentTextLayout}
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
          style={[styles.mediaContainer]}
        >
          {media}
        </AnimatedGradient>
      ) : (
        <Animated.View style={[animatedBackgroundColor, styles.mediaContainer]}>
          {media}
        </Animated.View>
      )}
    </View>
  )
}
