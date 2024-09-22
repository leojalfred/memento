import IconButton from '@/components/IconButton'
import Waveform from '@/components/Waveform'
import { colors } from '@/constants/colors'
import { Audio } from 'expo-av'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'

interface AttachmentAudioProps {
  sound?: Audio.Sound
  isEditing: boolean
}

export default function AttachmentAudio({
  sound,
  isEditing,
}: AttachmentAudioProps) {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false)
  useEffect(() => {
    if (sound) {
      if (isEditing) {
        sound.pauseAsync()
        setIsSoundPlaying(false)
      }
    }
  }, [sound, isEditing])

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const toggleSoundPlayback = useCallback(async () => {
    if (isSoundPlaying) {
      await sound?.pauseAsync()
      setIsSoundPlaying(false)
    } else {
      await sound?.playAsync()
      setIsSoundPlaying(true)
    }
  }, [isSoundPlaying, sound])

  return (
    <View className="w-[140px] flex-row items-center justify-between">
      <IconButton
        className="pr-4"
        icon={isSoundPlaying ? 'stop-circle' : 'play-circle'}
        color={colors.white}
        onPress={toggleSoundPlayback}
        disabled={isEditing}
      />
      <Waveform className="bg-white" count={24} isPlaying={isSoundPlaying} />
    </View>
  )
}
