import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { BarIndicator } from 'react-native-indicators'
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

  const [recording, setRecording] = useState<Audio.Recording>()
  const [permissionResponse, requestPermission] = Audio.usePermissions()

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..')
        await requestPermission()
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log('Starting recording..')
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      )
      setRecording(recording)
      console.log('Recording started')
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..')
    setRecording(undefined)
    await recording?.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
    const uri = recording?.getURI()
    console.log('Recording stopped and stored at', uri)
  }

  return (
    <>
      <View className="flex-row items-center justify-between">
        <View className="box-border w-fit flex-row overflow-hidden rounded-full border border-gray-700">
          <Animated.View className="flex-row" style={nonAudioAnimation}>
            <IconButton icon="image" onPress={() => pickMedia('image')} />
            <Divider />
            <IconButton icon="video" onPress={() => pickMedia('video')} />
            <Divider />
          </Animated.View>
          <Animated.View>
            <BarIndicator
              animationDuration={900}
              color={colors.gray[700]}
              count={16}
              size={12}
              style={{
                paddingLeft: 16,
              }}
            />
          </Animated.View>
          <IconButton
            icon={isRecorderOpen ? 'stop-circle' : 'mic'}
            onPress={() => {
              setIsRecorderOpen(!isRecorderOpen)

              // if (recording) stopRecording()
              // else startRecording()
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
