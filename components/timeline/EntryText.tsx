import type { AttachmentData } from '@/components/timeline/MediaPicker'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import Attachment from './Attachment'

interface EntryTextProps {
  value: string
  sortedAttachments: AttachmentData[]
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

          acc.push(
            <Attachment
              key={`attachment-${i}`}
              i={i}
              value={value}
              attachment={attachment}
              sortedAttachments={sortedAttachments}
            />,
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
