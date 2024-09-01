import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInput, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

const entrySchema = z.object({
  text: z.string(),
})

function MediaPicker() {
  return (
    <View className="flex-row self-start rounded-full border border-gray-700">
      <TouchableOpacity className="px-4 py-1">
        <Feather name="image" size={20} color={colors.gray[700]} />
      </TouchableOpacity>
      <View className="h-full w-px bg-gray-700" />
      <TouchableOpacity className="px-4 py-1">
        <Feather name="video" size={20} color={colors.gray[700]} />
      </TouchableOpacity>
      <View className="h-full w-px bg-gray-700" />
      <TouchableOpacity className="px-4 py-1">
        <Feather name="mic" size={20} color={colors.gray[700]} />
      </TouchableOpacity>
    </View>
  )
}

export default function HomeScreen() {
  const { control } = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
  })

  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const isMediaPickerShown = selectionEnd - selectionStart > 0

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
    <SafeAreaView>
      <View className="p-4">
        <Controller
          name="text"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mb-4 font-cp"
              autoFocus={true}
              multiline={true}
              placeholder="Start writing..."
              selectionColor={colors.gray[500]}
              value={value}
              onChangeText={onChange}
              onSelectionChange={(event) => {
                const { start, end } = event.nativeEvent.selection
                setSelectionStart(start)
                setSelectionEnd(end)
              }}
            />
          )}
        />
        <Animated.View style={animatedStyle}>
          <MediaPicker />
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
