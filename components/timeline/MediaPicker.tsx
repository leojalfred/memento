import type { Selection } from '@/app'
import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import { androidColorPairs, colors, iosColorPairs } from '@/constants/colors'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Platform, View } from 'react-native'
import { BarIndicator } from 'react-native-indicators'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export interface AttachmentData {
  start: number
  end: number
  uri: string
  colorPair: [string, string]
}

interface MediaPickerProps {
  selection: Selection
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentData[]>>
  disabled: boolean
}

export default function MediaPicker({
  selection,
  setAttachments,
  disabled,
}: MediaPickerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const pushAttachment = useCallback(
    (uri: string) => {
      const colorPair =
        Platform.OS === 'ios'
          ? iosColorPairs[Math.floor(Math.random() * iosColorPairs.length)]
          : androidColorPairs[
              Math.floor(Math.random() * androidColorPairs.length)
            ]

      setAttachments((attachments) => [
        ...attachments,
        {
          start: selection.start,
          end: selection.end,
          uri,
          colorPair,
        },
      ])
    },
    [setAttachments, selection.start, selection.end],
  )

  const pickMedia = async (type: 'image' | 'video') => {
    setIsLoading(true)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      pushAttachment(uri)

      console.log('Media loaded and stored at', uri)
    }
    setIsLoading(false)
  }

  const loaderOpacity = useSharedValue(0)
  useEffect(() => {
    loaderOpacity.value = withTiming(isLoading ? 1 : 0, { duration: 200 })
  }, [isLoading, loaderOpacity])
  const loaderAnimation = useAnimatedStyle(() => ({
    display: loaderOpacity.value === 0 ? 'none' : 'flex',
    opacity: loaderOpacity.value,
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
    if (uri) {
      pushAttachment(uri)
      console.log('Recording stopped and stored at', uri)
    }
  }

  const mediaPickerWidth = useSharedValue(148)
  useEffect(() => {
    mediaPickerWidth.value = withTiming(recording ? 130 : 148, {
      duration: 200,
    })
  }, [recording, mediaPickerWidth])
  const mediaPickerAnimation = useAnimatedStyle(() => ({
    width: mediaPickerWidth.value,
  }))

  const nonAudioOpacity = useSharedValue(1)
  const nonAudioWidth = useSharedValue(98)
  useEffect(() => {
    nonAudioOpacity.value = withTiming(recording ? 0 : 1, {
      duration: 200,
    })
    nonAudioWidth.value = withTiming(recording ? 0 : 98, {
      duration: 200,
    })
  }, [recording, nonAudioOpacity, nonAudioWidth])
  const nonAudioAnimation = useAnimatedStyle(() => ({
    display:
      nonAudioOpacity.value === 0 && nonAudioWidth.value === 0
        ? 'none'
        : 'flex',
    opacity: nonAudioOpacity.value,
    width: nonAudioWidth.value,
  }))

  const waveOpacity = useSharedValue(0)
  const wavePaddingLeft = useSharedValue(0)
  const waveWidth = useSharedValue(0)
  useEffect(() => {
    waveOpacity.value = withTiming(recording ? 1 : 0, {
      duration: 200,
    })
    wavePaddingLeft.value = withTiming(recording ? 16 : 0, {
      duration: 200,
    })
    waveWidth.value = withTiming(recording ? 80 : 0, {
      duration: 200,
    })
  }, [recording, waveOpacity, wavePaddingLeft, waveWidth])
  const waveAnimation = useAnimatedStyle(() => ({
    display:
      waveOpacity.value === 0 &&
      wavePaddingLeft.value === 0 &&
      waveWidth.value === 0
        ? 'none'
        : 'flex',
    opacity: waveOpacity.value,
    paddingLeft: wavePaddingLeft.value,
    width: waveWidth.value,
  }))

  return (
    <View className="flex-row items-center justify-between">
      <Animated.View
        className="box-border flex-row overflow-hidden rounded-full border border-gray-700"
        style={mediaPickerAnimation}
      >
        <Animated.View className="flex-row" style={nonAudioAnimation}>
          <IconButton
            icon="image"
            onPress={() => pickMedia('image')}
            disabled={disabled}
          />
          <Divider />
          <IconButton
            icon="video"
            onPress={() => pickMedia('video')}
            disabled={disabled}
          />
          <Divider />
        </Animated.View>
        <Animated.View style={waveAnimation}>
          <BarIndicator
            animationDuration={900}
            color={colors.gray[700]}
            count={16}
            size={12}
          />
        </Animated.View>
        <IconButton
          icon={recording ? 'stop-circle' : 'mic'}
          onPress={recording ? stopRecording : startRecording}
          disabled={disabled}
        />
      </Animated.View>
      <Animated.View style={loaderAnimation}>
        <ActivityIndicator size="small" color={colors.gray[700]} />
      </Animated.View>
    </View>
  )
}
