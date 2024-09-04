import type { Selection } from '@/app'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import colors from 'tailwindcss/colors'
import { z } from 'zod'
import MediaPicker from './MediaPicker'

interface EntryProps {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  selection: Selection
  setSelection: (selection: Selection) => void
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

  const mediaPickerOpacity = useSharedValue(0)
  useEffect(() => {
    mediaPickerOpacity.value = withTiming(
      selection.end - selection.start > 0 ? 1 : 0,
      { duration: 200 },
    )
  }, [selection, mediaPickerOpacity])
  const mediaPickerAnimation = useAnimatedStyle(() => {
    return {
      opacity: mediaPickerOpacity.value,
      display: mediaPickerOpacity.value === 0 ? 'none' : 'flex',
    }
  })

  return (
    <>
      <Animated.Text
        className="font-cp"
        style={textAnimation}
        onPress={() => setIsEditing(true)}
      >
        {getValues('text')}
      </Animated.Text>
      <Animated.View style={inputAnimation}>
        <Controller
          name="text"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="font-cp mb-4 rounded-lg border border-gray-700 p-2"
              autoFocus={true}
              contextMenuHidden={true}
              multiline={true}
              placeholder="Start writing..."
              selection={selection}
              selectionColor={colors.gray[500]}
              value={value}
              onChangeText={onChange}
              onSelectionChange={(event) => {
                const { start, end } = event.nativeEvent.selection
                setSelection({ start, end })
              }}
            />
          )}
        />
        <Animated.View style={mediaPickerAnimation}>
          <MediaPicker />
        </Animated.View>
      </Animated.View>
    </>
  )
}
