import AttachmentText from '@/components/timeline/AttachmentText'
import type { AttachmentData } from '@/types'
import { Image } from 'expo-image'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface AttachmentProps {
  i: number
  value: string
  attachment: AttachmentData
  sortedAttachments: AttachmentData[]
}

const width = 100

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

  const [textWidth, setTextWidth] = useState<number>()

  const text = value.slice(attachment.start, attachment.end)
  const aspectRatio = attachment.width! / attachment.height!
  const top = -((width / attachment.width!) * attachment.height! * 0.5) + 8.5
  const left = textWidth ? -width / 2 + textWidth / 2 : undefined

  return (
    <View key={`attachment-${i}`}>
      <AttachmentText
        className={classes}
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
      {attachment.type === 'image' && (
        <Image
          source={{ uri: attachment.uri }}
          accessibilityLabel={text}
          style={{
            position: 'absolute',
            aspectRatio,
            width,
            top,
            left,
            borderRadius: 8,
          }}
        />
      )}
    </View>
  )
}
