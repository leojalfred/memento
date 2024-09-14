import AttachmentText from '@/components/timeline/AttachmentText'
import type { AttachmentData } from '@/types'
import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface AttachmentProps {
  i: number
  value: string
  attachment: AttachmentData
  sortedAttachments: AttachmentData[]
}

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

  return (
    <View key={`attachment-${i}`}>
      <AttachmentText className={classes} colorPair={attachment.colorPair}>
        {value
          .slice(attachment.start, attachment.end)
          .split(/(\p{Emoji_Presentation})/u)
          .map((part, j) =>
            part.match(/\p{Emoji_Presentation}/u) ? (
              <Text key={`emoji-${i}-${j}`} className="text-[0.75rem]">
                {part}
              </Text>
            ) : (
              part
            ),
          )}
      </AttachmentText>
    </View>
  )
}
