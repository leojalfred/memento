import { Feather } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import colors from 'tailwindcss/colors'

export default function MediaPicker() {
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
