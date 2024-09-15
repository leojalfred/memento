import { colors } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import {
  GestureResponderEvent,
  TouchableOpacity,
  useColorScheme,
} from 'react-native'

interface IconButtonProps {
  icon: keyof typeof Feather.glyphMap
  onPress?: ((event: GestureResponderEvent) => void) | undefined
  disabled?: boolean
}

export default function IconButton({
  icon,
  onPress,
  disabled,
}: IconButtonProps) {
  const scheme = useColorScheme()

  return (
    <TouchableOpacity
      className="px-4 py-1"
      onPress={onPress}
      disabled={disabled}
    >
      <Feather
        name={icon}
        size={20}
        color={scheme === 'light' ? colors.gray[700] : colors.gray[300]}
      />
    </TouchableOpacity>
  )
}
