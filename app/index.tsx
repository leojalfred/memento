import Entry from '@/components/timeline/Entry'
import { useState } from 'react'
import { ScrollView, TouchableWithoutFeedback } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface Selection {
  start: number
  end: number
}

export default function TimelineScreen() {
  const [selection, setSelection] = useState<Selection>({ start: 0, end: 0 })
  const handleOutsidePress = () => setSelection({ start: 0, end: 0 })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleOutsidePress} accessible={false}>
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <Entry selection={selection} setSelection={setSelection} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}
