import { styled } from 'nativewind'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const StyledSafeAreaView = styled(SafeAreaView)
const StyledText = styled(Text)

export default function HomeScreen() {
  return (
    <StyledSafeAreaView className="items-center justify-center flex-1">
      <StyledText className="font-cp text-2xl">Memento</StyledText>
    </StyledSafeAreaView>
  )
}
