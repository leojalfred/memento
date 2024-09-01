import { zodResolver } from '@hookform/resolvers/zod'
import { styled } from 'nativewind'
import { Controller, useForm } from 'react-hook-form'
import { TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from 'tailwindcss/colors'
import { z } from 'zod'

const entrySchema = z.object({
  text: z.string(),
})

const StyledSafeAreaView = styled(SafeAreaView)
const StyledTextInput = styled(TextInput)

export default function HomeScreen() {
  const { control } = useForm<z.infer<typeof entrySchema>>({
    resolver: zodResolver(entrySchema),
  })

  return (
    <StyledSafeAreaView className="mx-4">
      <Controller
        name="text"
        control={control}
        render={({ field: { onChange, value } }) => (
          <StyledTextInput
            className="font-cp"
            autoFocus={true}
            multiline={true}
            placeholder="Start writing..."
            selectionColor={colors.gray[500]}
            value={value}
            onChangeText={onChange}
            onSelectionChange={(event) => {
              const { start, end } = event.nativeEvent.selection
              if (end - start > 0) console.log(value.substring(start, end))
            }}
          />
        )}
      />
    </StyledSafeAreaView>
  )
}
