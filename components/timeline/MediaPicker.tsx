import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { View } from 'react-native'

export default function MediaPicker() {
  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync()
    if (!result.canceled) {
      setImage(result.assets[0].uri)
      console.log(image)
    }
  }

  return (
    <View className="flex-row self-start rounded-full border border-gray-700">
      <IconButton icon="image" onPress={pickImage} />
      <Divider />
      <IconButton icon="video" />
      <Divider />
      <IconButton icon="mic" />
    </View>
  )
}
