import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

const entrySchema = z.object({
  text: z.string(),
})

export default function HomeScreen() {
  const { control } = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
  })

  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)
  const isMediaPickerShown = selectionEnd - selectionStart > 0

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
        {isMediaPickerShown && (
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
        )}
      </View>
    </SafeAreaView>
  )
}
