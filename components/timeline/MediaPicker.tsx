import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export default function MediaPicker() {
  const [media, setMedia] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(isLoading ? 1 : 0, { duration: 200 })
  }, [isLoading, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value === 0 ? 'none' : 'flex',
  }))

  const pickMedia = async (type: 'image' | 'video') => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  return (
    <View className="flex-row justify-between">
      <View className="flex-row rounded-full border border-gray-700">
        <IconButton icon="image" onPress={() => pickMedia('image')} />
        <Divider />
        <IconButton icon="video" onPress={() => pickMedia('video')} />
        <Divider />
        <IconButton icon="mic" />
      </View>
      <Animated.View style={animatedStyle}>
        <ActivityIndicator size="small" color="#374151" />
      </Animated.View>
    </View>
  )
}
