import type { Selection } from '@/app'
import MediaPicker from '@/components/timeline/MediaPicker'
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

interface EntryProps {
  selection: Selection
  setSelection: (selection: Selection) => void
}

const entrySchema = z.object({
  text: z.string(),
})

export default function Entry({ selection, setSelection }: EntryProps) {
  const { control } = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
  })

  const isMediaPickerShown = selection.end - selection.start > 0

  const opacity = useSharedValue(0)
  useEffect(() => {
    opacity.value = withTiming(isMediaPickerShown ? 1 : 0, { duration: 200 })
  }, [isMediaPickerShown, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      display: opacity.value === 0 ? 'none' : 'flex',
    }
  })

  return (
    <>
      <Controller
        name="text"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mb-4 font-cp"
            autoFocus={true}
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
      <Animated.View style={animatedStyle}>
        <MediaPicker />
      </Animated.View>
    </>
  )
}
