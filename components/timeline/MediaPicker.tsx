import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { View } from 'react-native'

export default function MediaPicker() {
  const [media, setMedia] = useState<string | null>(null)

  const pickMedia = async (type: 'image' | 'video') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
    })

    if (!result.canceled) {
      setMedia(result.assets[0].uri)
      console.log(result.assets[0].uri)
    }
  }

  return (
    <View className="flex-row self-start rounded-full border border-gray-700">
      <IconButton icon="image" onPress={() => pickMedia('image')} />
      <Divider />
      <IconButton icon="video" onPress={() => pickMedia('video')} />
      <Divider />
      <IconButton icon="mic" />
    </View>
  )
}
