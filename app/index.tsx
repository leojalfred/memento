import { styled } from 'nativewind'
import { TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const StyledTextInput = styled(TextInput)

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <StyledTextInput
        className="mx-4 font-cp"
        placeholder="Start writing..."
        multiline={true}
      />
    </SafeAreaView>
  )
}
