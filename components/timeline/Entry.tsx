import type { Selection } from '@/app'
import EntryText from '@/components/timeline/EntryText'
import EntryTextInput, {
  entrySchema,
} from '@/components/timeline/EntryTextInput'
import MediaPicker, { type Attachment } from '@/components/timeline/MediaPicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { z } from 'zod'

interface EntryProps {
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  selection: Selection
  setSelection: React.Dispatch<React.SetStateAction<Selection>>
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Entry({
  isEditing,
  setIsEditing,
  selection,
  setSelection,
}: EntryProps) {
  const { control, getValues } = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      text: "Bruh, so like, I was vibin' the other day, straight chillin' with my squad, and outta nowhere, someone goes full sus mode, all sketch, like fr? I was lowkey shook, but I kept it 100, no cap 🧢. Then my homie starts flexin’ his drip, totally bussin’, and I’m like “yo, deadass?” We just tryna keep it Gucci, but the whole sitch got hella goofy, ngl. At the end of the day, we all just finna bounce, cuz ain’t nobody got time for that energy. Keep it savage, fam, issa whole vibe.",
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

  const isMediaPickerShown = useMemo(() => {
    if (selection.end - selection.start <= 0) return false

    return !attachments.some(
      (attachment) =>
        (attachment.start <= selection.start &&
          attachment.end > selection.start) ||
        (attachment.start < selection.end && attachment.end >= selection.end) ||
        (attachment.start >= selection.start &&
          attachment.end <= selection.end),
    )
  }, [selection, attachments])
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
      <AnimatedPressable
        style={textAnimation}
        onPress={() => setIsEditing(true)}
      >
        <EntryText value={value} sortedAttachments={sortedAttachments} />
      </AnimatedPressable>
      <Animated.View style={inputAnimation}>
        <EntryTextInput
          value={value}
          sortedAttachments={sortedAttachments}
          control={control}
          setAttachments={setAttachments}
          selection={selection}
          setSelection={setSelection}
        />
        <Animated.View style={mediaPickerAnimation}>
          <MediaPicker selection={selection} setAttachments={setAttachments} />
        </Animated.View>
      </Animated.View>
    </>
  )
}
