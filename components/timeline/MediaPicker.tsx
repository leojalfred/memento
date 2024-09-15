import Divider from '@/components/Divider'
import IconButton from '@/components/IconButton'
import { androidColorPairs, colors, iosColorPairs } from '@/constants/colors'
import type { AttachmentData, AttachmentType, Selection } from '@/types'
import { yap } from '@/utils/logging'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Platform, useColorScheme, View } from 'react-native'
import { BarIndicator } from 'react-native-indicators'
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
  const pushAttachment = useCallback(
    (type: AttachmentType, uri: string, height?: number, width?: number) => {
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

  const [recording, setRecording] = useState<Audio.Recording>()
  const [permissionResponse, requestPermission] = Audio.usePermissions()
  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        yap('Requesting permission..')
        await requestPermission()
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      yap('Starting recording..')
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      )
      setRecording(recording)
      yap('Recording started')
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }
  async function stopRecording() {
    yap('Stopping recording..')

    setRecording(undefined)
    await recording?.stopAndUnloadAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })

    const uri = recording?.getURI()
    if (uri) {
      pushAttachment('audio', uri)
      yap('Recording stopped and stored at', uri)
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

  const scheme = useColorScheme()

  return (
    <View className="flex-row items-center justify-between">
      <Animated.View
        className="box-border flex-row overflow-hidden rounded-full border border-gray-700 dark:border-gray-300"
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
            color={scheme === 'light' ? colors.gray[700] : colors.gray[300]}
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
        <ActivityIndicator
          size="small"
          color={scheme === 'light' ? colors.gray[700] : colors.gray[300]}
        />
      </Animated.View>
    </View>
  )
}
