import type { AttachmentData } from '@/types'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import Attachment from './Attachment'

interface EntryTextProps {
  value: string
  sortedAttachments: AttachmentData[]
  isEditing: boolean
  scrollY: SharedValue<number>
}

export default function EntryText({
  value,
  sortedAttachments,
  isEditing,
  scrollY,
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
                key={`previous-${attachment.start}-${attachment.end}-${j}`}
                className="font-cp -z-[1] ml-2.5 leading-[1.3125] text-zinc-900 dark:text-zinc-100"
              >
                {word}
              </Text>,
            )
          })

          acc.push(
            <Attachment
              key={`attachment-${attachment.start}-${attachment.end}`}
              i={i}
              value={value}
              attachment={attachment}
              sortedAttachments={sortedAttachments}
              isEditing={isEditing}
              scrollY={scrollY}
            />,
          )

          if (i === sortedAttachments.length - 1) {
            const remainingText = value.slice(attachment.end).trim()
            remainingText.split(' ').forEach((word, j) => {
              acc.push(
                <Text
                  key={`remaining-${attachment.start}-${attachment.end}-${j}`}
                  className="font-cp -z-[1] ml-2.5 leading-[1.3125] text-zinc-900 dark:text-zinc-100"
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
      <Text className="font-cp leading-[1.3125] text-zinc-900 dark:text-zinc-100">
        {value}
      </Text>
    )
  }, [sortedAttachments, value, isEditing, scrollY])
}
