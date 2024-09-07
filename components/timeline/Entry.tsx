import type { Selection } from '@/app'
import { zodResolver } from '@hookform/resolvers/zod'
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

  const textOpacity = useSharedValue(0)
  const inputOpacity = useSharedValue(1)
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
    return value.split(' ').map((word, index) => {
      return (
        <Text key={`word-${index}`} className="font-cp">
          {word}{' '}
        </Text>
      )
    })
  }, [value])
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

  const isMediaPickerShown = useMemo(
    () =>
      selection.end - selection.start > 0 &&
      !attachments.some(
        (attachment) =>
          (attachment.start <= selection.start &&
            attachment.end > selection.start) ||
          (attachment.start < selection.end &&
            attachment.end >= selection.end) ||
          (attachment.start >= selection.start &&
            attachment.end <= selection.end),
      ),
    [selection, attachments],
  )
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
      <Animated.View className="font-cp" style={textAnimation}>
        <Pressable
          className="flex-row flex-wrap"
          onPress={() => setIsEditing(true)}
        >
          {text}
        </Pressable>
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
