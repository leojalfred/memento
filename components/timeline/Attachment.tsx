import AttachmentMedia, {
  AttachmentMediaStyles,
} from '@/components/timeline/AttachmentMedia'
import AttachmentText from '@/components/timeline/AttachmentText'
import type { AttachmentData } from '@/types'
import { Audio } from 'expo-av'
import { useCallback, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native'
import {
  interpolateColor,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

const mediaWidth = 128
const padding = 4
const borderRadius = 8
const audioPlayerHeight = 28.3
const audioPlayerWidth = 172

interface AttachmentProps {
  i: number
  value: string
  attachment: AttachmentData
  sortedAttachments: AttachmentData[]
  isEditing: boolean
  scrollY: SharedValue<number>
}

export default function Attachment({
  i,
  value,
  attachment,
  sortedAttachments,
  isEditing,
  scrollY,
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

  const { width: screenWidth } = useWindowDimensions()
  const [styles, setStyles] = useState<AttachmentMediaStyles>()
  const [top, setTop] = useState(0)
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (isEditing) return

      const isAttachmentAfterFirstSpace = attachment.start > value.indexOf(' ')
      event.target.measure((x, y, width, height, pageX, pageY) => {
        if (['image', 'video'].includes(attachment.type)) {
          const scaledAttachmentHeight =
            (mediaWidth / attachment.width!) * attachment.height!

          const aspectRatio = attachment.width! / attachment.height!
          const top = (height - scaledAttachmentHeight) / 2 - padding
          setTop(top)

          let left = (width - mediaWidth) / 2 - padding + 5.25
          if (pageX + left < 0) left = 0
          if (pageX + left + mediaWidth + padding * 2 > screenWidth)
            left = width - mediaWidth - padding * 2 + 18
          if (!isAttachmentAfterFirstSpace) left -= 5.25

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
          setTop(top)

          let left = (width - audioPlayerWidth) / 2 + 5.25
          if (pageX + left < 0) left = 0
          if (pageX + left + audioPlayerWidth > screenWidth)
            left = width - audioPlayerWidth + 18
          if (!isAttachmentAfterFirstSpace) left -= 5.25

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
      })
    },
    [
      isEditing,
      attachment.start,
      attachment.type,
      attachment.height,
      attachment.width,
      screenWidth,
      value,
    ],
  )

  const text = value.slice(attachment.start, attachment.end)
  const [isMediaVisible, setIsMediaVisible] = useState(false)

  return (
    <View>
      <AttachmentText
        isMediaVisible={isMediaVisible}
        className={classes}
        animatedColors={animatedColors}
        animatedBackgroundColor={animatedBackgroundColor}
        colorPair={attachment.colorPair}
        onLayout={onLayout}
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
      <AttachmentMedia
        attachment={attachment}
        isEditing={isEditing}
        styles={styles}
        text={text}
        animatedColors={animatedColors}
        animatedBackgroundColor={animatedBackgroundColor}
        scrollY={scrollY}
        isMediaVisible={isMediaVisible}
        setIsMediaVisible={setIsMediaVisible}
        top={top}
      />
    </View>
  )
}
