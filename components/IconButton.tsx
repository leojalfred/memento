import { colors } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import { GestureResponderEvent, TouchableOpacity } from 'react-native'

interface IconButtonProps {
  icon: keyof typeof Feather.glyphMap
  onPress?: ((event: GestureResponderEvent) => void) | undefined
}

export default function IconButton({ icon, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity className="px-4 py-1" onPress={onPress}>
      <Feather name={icon} size={20} color={colors.gray[700]} />
    </TouchableOpacity>
  )
}
