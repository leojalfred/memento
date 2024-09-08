import type { Selection } from '@/app'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { cssInterop } from 'nativewind'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  type NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  type TextInputSelectionChangeEventData,
  View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import colors from 'tailwindcss/colors'
import { z } from 'zod'
import MediaPicker, { type Attachment, highlightColors } from './MediaPicker'

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
})

function GradientBackgroundText({ children }: { children: string }) {
  return (
    <LinearGradient
      colors={[colors.violet[500], colors.rose[500]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="ml-2.5"
    >
      <Text className="font-cp">{children}</Text>
    </LinearGradient>
  )
}

interface EntryProps {
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  selection: Selection
  setSelection: React.Dispatch<React.SetStateAction<Selection>>
}

const entrySchema = z.object({
  text: z.string(),
})

export default function Entry({
  isEditing,
  setIsEditing,
  selection,
  setSelection,
}: EntryProps) {
  const { control, getValues } = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      text: 'Intentions passion merciful self abstract sea. Battle society dead revaluation salvation justice convictions merciful truth insofar. Morality evil contradict christianity sexuality moral derive play deceptions. Play snare inexpedient merciful society good endless joy derive. Suicide joy morality spirit insofar.',
    },
  })

  const [attachments, setAttachments] = useState<Attachment[]>([])
  useEffect(() => {
    console.log('Attachments:', attachments)
  }, [attachments])

  const textOpacity = useSharedValue(1)
  const inputOpacity = useSharedValue(0)
  useEffect(() => {
    if (isEditing) {
      textOpacity.value = withTiming(0, { duration: 100 }, () => {
        inputOpacity.value = withTiming(1, { duration: 100 })
      })
    } else {
      inputOpacity.value = withTiming(0, { duration: 100 }, () => {
        textOpacity.value = withTiming(1, { duration: 100 })
      })
    }
  }, [isEditing, textOpacity, inputOpacity])
  const textAnimation = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    display: textOpacity.value === 0 ? 'none' : 'flex',
  }))
  const inputAnimation = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    display: inputOpacity.value === 0 ? 'none' : 'flex',
  }))

  const value = getValues('text')
  const sortedAttachments = useMemo(
    () => [...attachments].sort((a, b) => a.end - b.end),
    [attachments],
  )
  const text = useMemo(() => {
    return sortedAttachments.length > 0 ? (
      <View className="-ml-2.5 flex-row flex-wrap">
        {sortedAttachments.reduce<React.ReactNode[]>((acc, attachment, i) => {
          const previousText = value
            .slice(i > 0 ? sortedAttachments[i - 1].end : 0, attachment.start)
            .trim()
          previousText.split(' ').forEach((word, j) => {
            acc.push(
              <Text key={`previous-${i}-${j}`} className="font-cp ml-2.5">
                {word}
              </Text>,
            )
          })

          acc.push(
            <GradientBackgroundText key={`start-${i}`}>
              {value.slice(attachment.start, attachment.end)}
            </GradientBackgroundText>,
          )

          if (i === sortedAttachments.length - 1) {
            const remainingText = value.slice(attachment.end).trim()
            remainingText.split(' ').forEach((word, j) => {
              acc.push(
                <Text key={`remaining-${i}-${j}`} className="font-cp ml-2.5">
                  {word}
                </Text>,
              )
            })
          }

          return acc
        }, [])}
      </View>
    ) : (
      <Text className="font-cp">{value}</Text>
    )
  }, [value, sortedAttachments])
  const inputText = useMemo(() => {
    return sortedAttachments.length > 0
      ? sortedAttachments.reduce<React.ReactNode[]>(
          (acc, attachment, index) => {
            const previousEnd = index > 0 ? sortedAttachments[index - 1].end : 0

            acc.push(value.slice(previousEnd, attachment.start))
            acc.push(
              <Text
                key={index}
                className={highlightColors[attachment.backgroundColorIndex]}
              >
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

  const isMediaPickerShown = useMemo(() => {
    // Check if selection is not empty
    if (selection.end - selection.start <= 0) return false

    // Find the start and end of the words containing the selection
    const wordStartIndex = value.lastIndexOf(' ', selection.start - 1) + 1
    const wordEndIndex =
      value.indexOf(' ', selection.end) === -1
        ? value.length
        : value.indexOf(' ', selection.end)

    // Check if selection covers exactly one word
    if (selection.start !== wordStartIndex || selection.end !== wordEndIndex) {
      return false
    }

    // Check if the selected word doesn't contain any spaces
    const selectedWord = value.slice(wordStartIndex, wordEndIndex)
    if (selectedWord.includes(' ')) {
      return false
    }

    // Check if selection contains any attachments
    return !attachments.some(
      (attachment) =>
        (attachment.start <= selection.start &&
          attachment.end > selection.start) ||
        (attachment.start < selection.end && attachment.end >= selection.end) ||
        (attachment.start >= selection.start &&
          attachment.end <= selection.end),
    )
  }, [selection, attachments, value])
  const mediaPickerOpacity = useSharedValue(0)
  useEffect(() => {
    mediaPickerOpacity.value = withTiming(isMediaPickerShown ? 1 : 0, {
      duration: 200,
    })
  }, [mediaPickerOpacity, isMediaPickerShown])
  const mediaPickerAnimation = useAnimatedStyle(() => {
    return {
      opacity: mediaPickerOpacity.value,
      display: mediaPickerOpacity.value === 0 ? 'none' : 'flex',
    }
  })

  return (
    <>
      <Animated.View style={textAnimation}>
        <Pressable onPress={() => setIsEditing(true)}>{text}</Pressable>
      </Animated.View>
      <Animated.View style={inputAnimation}>
        <Controller
          name="text"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View className="relative">
              <Text className="font-cp absolute left-px right-0 top-px p-2">
                {inputText}
              </Text>
              <TextInput
                className="font-cp mb-4 rounded-lg border border-gray-700 p-2 text-transparent"
                autoFocus={true}
                contextMenuHidden={true}
                multiline={true}
                placeholder="Start writing..."
                selection={selection}
                selectionColor={colors.gray[500]}
                value={value}
                onChangeText={(newText) => {
                  onChange(newText)
                  adjustAttachments(newText, value)
                }}
                onSelectionChange={onSelectionChange}
              />
            </View>
          )}
        />
        <Animated.View style={mediaPickerAnimation}>
          <MediaPicker selection={selection} setAttachments={setAttachments} />
        </Animated.View>
      </Animated.View>
    </>
  )
}
