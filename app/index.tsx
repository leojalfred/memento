import { Feather } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
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

  return (
    <SafeAreaView className="mx-4">
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
              if (end - start > 0) console.log(value.substring(start, end))
            }}
          />
        )}
      />
      <View className="flex-row border border-gray-400 p-0">
        <TouchableOpacity>
          <Feather name="image" size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="video" size={24} color={colors.gray[700]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="mic" size={24} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
