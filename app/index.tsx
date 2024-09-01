import { styled } from 'nativewind'
import { TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'

const StyledTextInput = styled(TextInput)

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <StyledTextInput
        className="mx-4 font-cp"
        autoFocus={true}
        multiline={true}
        placeholder="Start writing..."
        selectionColor={colors.gray[500]}
        onSelectionChange={(event) => {
          const { selection } = event.nativeEvent
          if (selection.end - selection.start > 0) {
            console.log(selection)
          }
        }}
      />
    </SafeAreaView>
  )
}
