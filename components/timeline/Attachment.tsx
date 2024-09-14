import AnimatedGradient from '@/components/AnimatedGradient'
import AttachmentText from '@/components/timeline/AttachmentText'
import type { AttachmentData } from '@/types'
import { Image } from 'expo-image'
import { useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
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
}

const width = 100
const padding = 4
const borderRadius = 8

export default function Attachment({
  i,
  value,
  attachment,
  sortedAttachments,
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
  const aspectRatio = attachment.width! / attachment.height!
  const top =
    -((width / attachment.width!) * attachment.height! * 0.5) + 8.5 - padding
  const left = textWidth
    ? -width / 2 + textWidth / 2 + 5.25 - padding
    : undefined

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

  let media
  if (attachment.type === 'image')
    media = (
      <Image
        source={{ uri: attachment.uri }}
        accessibilityLabel={text}
        style={{
          aspectRatio,
          width,
          borderRadius,
        }}
      />
    )

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
          style={styles.mediaContainer}
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
