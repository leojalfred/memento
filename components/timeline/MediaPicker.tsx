import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import Waveform from '@/components/Waveform'
import { androidColorPairs, colors, iosColorPairs } from '@/constants/colors'
import type { AttachmentData, AttachmentType, Selection } from '@/types'
import { yap } from '@/utils/logging'
import { Audio, InterruptionModeIOS } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, View, useColorScheme } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

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
  function pushAttachment(
    type: AttachmentType,
    uri: string,
    height?: number,
    width?: number,
  ) {
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
        type,
        uri,
        height,
        width,
        colorPair,
      },
    ])
  }

  async function pickMedia(type: 'image' | 'video') {
    setIsLoading(true)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
    })

    if (!result.canceled) {
      const { uri, height, width } = result.assets[0]
      pushAttachment(type, uri, height, width)

      yap('Media loaded and stored at', uri)
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

  const [permissionResponse, requestPermission] = Audio.usePermissions()
  const [recording, setRecording] = useState(new Audio.Recording())
  const [isRecordingPrepared, setIsRecordingPrepared] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    const prepareRecording = async () => {
      setIsRecordingPrepared(true)

      try {
        if (permissionResponse?.status !== 'granted') {
          yap('Requesting permission..')
          await requestPermission()
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        })

        await recording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        )
      } catch (error) {
        setIsRecordingPrepared(false)
        console.error('Failed to prepare recording:', error)
      }
    }

    if (!isRecordingPrepared) prepareRecording()
  }, [permissionResponse, requestPermission, recording, isRecordingPrepared])

  async function startRecording() {
    try {
      if (isRecordingPrepared) {
        yap('Starting recording..')
        await recording.startAsync()
        setIsRecording(true)
      }
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  async function stopRecording() {
    try {
      yap('Stopping recording..')

      await recording.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })

      setRecording(new Audio.Recording())
      setIsRecording(false)
      setIsRecordingPrepared(false)

      const uri = recording.getURI()
      if (uri) {
        pushAttachment('audio', uri)
        yap('Recording stopped and stored at', uri)
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
    }
  }

  const mediaPickerWidth = useSharedValue(148)
  useEffect(() => {
    mediaPickerWidth.value = withTiming(isRecording ? 174 : 148, {
      duration: 200,
    })
  }, [isRecording, mediaPickerWidth])
  const mediaPickerAnimation = useAnimatedStyle(() => ({
    width: mediaPickerWidth.value,
  }))

  const nonAudioOpacity = useSharedValue(1)
  const nonAudioWidth = useSharedValue(98)
  useEffect(() => {
    nonAudioOpacity.value = withTiming(isRecording ? 0 : 1, {
      duration: 200,
    })
    nonAudioWidth.value = withTiming(isRecording ? 0 : 98, {
      duration: 200,
    })
  }, [isRecording, nonAudioOpacity, nonAudioWidth])
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
    waveOpacity.value = withTiming(isRecording ? 1 : 0, {
      duration: 200,
    })
    wavePaddingLeft.value = withTiming(isRecording ? 16 : 0, {
      duration: 200,
    })
    waveWidth.value = withTiming(isRecording ? 124 : 0, {
      duration: 200,
    })
  }, [isRecording, waveOpacity, wavePaddingLeft, waveWidth])
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

  const scheme = useColorScheme()

  return (
    <View className="flex-row items-center justify-between">
      <Animated.View
        className="box-border flex-row items-center overflow-hidden rounded-full border border-gray-700 dark:border-gray-300"
        style={mediaPickerAnimation}
      >
        <Animated.View className="flex-row" style={nonAudioAnimation}>
          <IconButton
            className="px-4 py-1"
            icon="image"
            onPress={() => pickMedia('image')}
            disabled={disabled}
          />
          <Divider />
          <IconButton
            className="px-4 py-1"
            icon="video"
            onPress={() => pickMedia('video')}
            disabled={disabled}
          />
          <Divider />
        </Animated.View>
        <Animated.View style={waveAnimation}>
          <Waveform count={24} isPlaying={isRecording} />
        </Animated.View>
        <IconButton
          className="px-4 py-1"
          icon={isRecording ? 'stop-circle' : 'mic'}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={disabled}
        />
      </Animated.View>
      <Animated.View style={loaderAnimation}>
        <ActivityIndicator
          size="small"
          color={scheme === 'light' ? colors.gray[700] : colors.gray[300]}
        />
      </Animated.View>
    </View>
  )
}
