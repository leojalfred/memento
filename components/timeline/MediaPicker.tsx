import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import { View } from 'react-native'

export default function MediaPicker() {
  return (
    <View className="flex-row self-start rounded-full border border-gray-700">
      <IconButton icon="image" />
      <Divider />
      <IconButton icon="video" />
      <Divider />
      <IconButton icon="mic" />
    </View>
  )
}
