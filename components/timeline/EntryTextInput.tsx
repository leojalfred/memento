import { colors } from '@/constants/colors'
import type { AttachmentData, Selection } from '@/types'
import { useMemo } from 'react'
import { Control, Controller } from 'react-hook-form'
import {
  type NativeSyntheticEvent,
  Platform,
  Text,
  TextInput,
  type TextInputSelectionChangeEventData,
  View,
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export const entrySchema = z.object({
  text: z.string(),
})

interface EntryTextInputProps {
  value: string
  sortedAttachments: AttachmentData[]
  control: Control<z.infer<typeof entrySchema>>
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentData[]>>
  selection: Selection
  setSelection: React.Dispatch<React.SetStateAction<Selection>>
}

export default function EntryTextInput({
  value,
  sortedAttachments,
  control,
  setAttachments,
  selection,
  setSelection,
}: EntryTextInputProps) {
  const inputText = useMemo(() => {
    return sortedAttachments.length > 0
      ? sortedAttachments.reduce<React.ReactNode[]>(
          (acc, attachment, index) => {
            const previousEnd = index > 0 ? sortedAttachments[index - 1].end : 0

            acc.push(value.slice(previousEnd, attachment.start))
            acc.push(
              <Text key={index} className="bg-yellow-200 text-zinc-900">
                {value.slice(attachment.start, attachment.end)}
              </Text>,
            )
            if (index === sortedAttachments.length - 1) {
              acc.push(value.slice(attachment.end))
            }

            return acc
          },
          [],
        )
      : value
  }, [value, sortedAttachments])

  function adjustAttachments(newText: string, value: string) {
    const difference = newText.length - value.length
    if (difference !== 0) {
      setAttachments((attachments) =>
        attachments.map((attachment) => {
          if (selection.start <= attachment.start) {
            return {
              ...attachment,
              start: attachment.start + difference,
              end: attachment.end + difference,
            }
          } else if (selection.start < attachment.end) {
            return {
              ...attachment,
              end: Math.max(attachment.start, attachment.end + difference),
            }
          }
          return attachment
        }),
      )
    }
  }

  function onSelectionChange(
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) {
    const { start, end } = event.nativeEvent.selection
    setSelection({ start, end })
  }

  const inputTextClasses = useMemo(() => {
    return twMerge(
      'font-cp absolute bottom-px left-px right-px top-[1.5px] p-2 leading-[1.123] text-zinc-900 dark:text-zinc-100',
      Platform.OS === 'ios' ? 'top-[1.5px]' : 'top-px',
    )
  }, [])

  return (
    <Controller
      name="text"
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          <Text className={inputTextClasses}>{inputText}</Text>
          {Platform.OS === 'ios' ? (
            <TextInput
              className="font-cp mb-4 rounded-lg border border-gray-700 p-2 text-transparent dark:border-gray-300"
              contextMenuHidden={true}
              multiline={true}
              placeholder="Start writing..."
              scrollEnabled={false}
              selection={selection}
              selectionColor={colors.gray[500]}
              value={value}
              onChangeText={(newText) => {
                onChange(newText)
                adjustAttachments(newText, value)
              }}
              onSelectionChange={onSelectionChange}
            />
          ) : (
            <View className="mb-4 rounded-lg border border-gray-700 p-2 dark:border-gray-300">
              <TextInput
                className="font-cp leading-[1.123] text-transparent"
                contextMenuHidden={true}
                multiline={true}
                placeholder="Start writing..."
                selection={selection}
                selectionColor="rgba(107, 114, 128, 0.3)"
                value={value}
                onChangeText={(newText) => {
                  onChange(newText)
                  adjustAttachments(newText, value)
                }}
                onSelectionChange={onSelectionChange}
              />
            </View>
          )}
        </>
      )}
    />
  )
}
