import AttachmentText from '@/components/timeline/AttachmentText'
import { type Attachment } from '@/components/timeline/MediaPicker'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

interface EntryTextProps {
  value: string
  sortedAttachments: Attachment[]
}

export default function EntryText({
  value,
  sortedAttachments,
}: EntryTextProps) {
  return useMemo(() => {
    return sortedAttachments.length > 0 ? (
      <View className="-ml-2.5 flex-row flex-wrap">
        {sortedAttachments.reduce<React.ReactNode[]>((acc, attachment, i) => {
          const previousText = value
            .slice(i > 0 ? sortedAttachments[i - 1].end : 0, attachment.start)
            .trim()
          previousText.split(' ').forEach((word, j) => {
            acc.push(
              <Text
                key={`previous-${i}-${j}`}
                className="font-cp ml-2.5 leading-[1.3125]"
              >
                {word}
              </Text>,
            )
          })

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

          acc.push(
            <AttachmentText
              key={`attachment-${i}`}
              className={classes}
              colorPair={attachment.colorPair}
            >
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
            </AttachmentText>,
          )

          if (i === sortedAttachments.length - 1) {
            const remainingText = value.slice(attachment.end).trim()
            remainingText.split(' ').forEach((word, j) => {
              acc.push(
                <Text
                  key={`remaining-${i}-${j}`}
                  className="font-cp ml-2.5 leading-[1.3125]"
                >
                  {word}
                </Text>,
              )
            })
          }

          return acc
        }, [])}
      </View>
    ) : (
      <Text className="font-cp leading-[1.3125]">{value}</Text>
    )
  }, [value, sortedAttachments])
}
