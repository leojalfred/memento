import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import {
  Waveform,
  type IWaveformRef,
} from '@simform_solutions/react-native-audio-waveform'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import colors from 'tailwindcss/colors'

export default function MediaPicker() {
  const [media, setMedia] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const loaderOpacity = useSharedValue(0)

  useEffect(() => {
    loaderOpacity.value = withTiming(isLoading ? 1 : 0, { duration: 200 })
  }, [isLoading, loaderOpacity])

  const loaderAnimation = useAnimatedStyle(() => ({
    display: loaderOpacity.value === 0 ? 'none' : 'flex',
    opacity: loaderOpacity.value,
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

  const ref = useRef<IWaveformRef>(null)

  const [isRecorderOpen, setIsRecorderOpen] = useState(false)
  const nonAudioOpacity = useSharedValue(1)
  const nonAudioWidth = useSharedValue(98)
  useEffect(() => {
    nonAudioOpacity.value = withTiming(isRecorderOpen ? 0 : 1, {
      duration: 200,
    })
    nonAudioWidth.value = withTiming(isRecorderOpen ? 0 : 98, {
      duration: 400,
    })
  }, [isRecorderOpen, nonAudioWidth, nonAudioOpacity])
  const nonAudioAnimation = useAnimatedStyle(() => ({
    display:
      nonAudioOpacity.value === 0 && nonAudioWidth.value === 0
        ? 'none'
        : 'flex',
    opacity: nonAudioOpacity.value,
    width: nonAudioWidth.value,
  }))

  const waveOpacity = useSharedValue(0)
  useEffect(() => {
    waveOpacity.value = withTiming(isRecorderOpen ? 1 : 0, { duration: 200 })
  }, [isRecorderOpen, waveOpacity])
  const waveAnimation = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
  }))

  return (
    <>
      <View className="flex-row justify-between">
        <View className="box-border w-fit flex-row overflow-hidden rounded-full border border-gray-700">
          <Animated.View className="flex-row" style={nonAudioAnimation}>
            <IconButton icon="image" onPress={() => pickMedia('image')} />
            <Divider />
            <IconButton icon="video" onPress={() => pickMedia('video')} />
            <Divider />
          </Animated.View>
          <Animated.View style={waveAnimation}>
            <Waveform
              mode="live"
              ref={ref}
              candleHeightScale={1}
              onRecorderStateChange={(recorderState) =>
                console.log(recorderState)
              }
              waveColor={colors.gray[700]}
              containerStyle={{
                display: isRecorderOpen ? 'flex' : 'none',
                height: 27.3,
              }}
            />
          </Animated.View>
          <IconButton
            icon={isRecorderOpen ? 'stop-circle' : 'mic'}
            onPress={() => {
              setIsRecorderOpen(!isRecorderOpen)
            }}
          />
        </View>
        <Animated.View style={loaderAnimation}>
          <ActivityIndicator size="small" color="#374151" />
        </Animated.View>
      </View>
    </>
  )
}
